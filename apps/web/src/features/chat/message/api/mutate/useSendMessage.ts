import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { fillMissingAttachment } from "@/features/chat/message/utils/fillMissingAttachments"
import { useMessageAttachmentsUpload } from "@/features/upload/hooks/useMessageAttachmentsUpload"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { MessageSocket } from "@/shared/lib/socket/socketFactory"
import {
  CreateMessageAttachmentDto,
  CreateMessageDto
} from "@/shared/types/api.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import { buildOptimisticMessage } from "../../utils/buildOptimisticMessage"
import { useReplyMessage } from "../hooks/useReplyMessage"
import { useAttachmentUpload } from "../hooks/useAttachmentUpload"

type SendMessageVariables = Omit<
  CreateMessageDto,
  "attachments" | "roomId" | "replyToMessageId"
> & {
  roomId: string
  files?: File[]
  replyMessage?: ChatUIMessage
}

export function useSendMessage(chatId: string, socket: MessageSocket | null) {
  const queryClient = useQueryClient()
  const sender = useCurrentUser()
  const [uploadAllFiles] = useAttachmentUpload(chatId)

  const { mutate: handleSendMessage } = useMutation<
    ChatUIMessage,
    Error,
    SendMessageVariables,
    { previousMessages: ChatUIMessage[]; tempId: string; filesCount?: number }
  >({
    mutationKey: chatKeys.sendMessages(chatId),
    mutationFn: async ({ roomId, text, files, replyMessage }) => {
      if (!text && !files) {
        throw new Error("Cannot send empty message :(")
      }

      const attachments: CreateMessageAttachmentDto[] = files
        ? await uploadAllFiles(files)
        : []

      if (!socket) {
        throw new Error("Invalid socket")
      }

      const msg = await socket.timeout(5000).emitWithAck("message.send", {
        roomId: chatId,
        text,
        replyToMessageId: replyMessage?.id,
        attachments
      })

      return mapAPIMessageToUI(msg, "sent", false)
    },

    onMutate: async ({ text, files, replyMessage }) => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      })

      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>(chatKeys.messages(chatId)) ??
        []

      const optimisticMessage: ChatUIMessage = buildOptimisticMessage({
        roomId: chatId,
        sender,
        files,
        replyMessage,
        text
      })

      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old => [...(old ?? []), optimisticMessage]
      )

      return {
        previousMessages,
        tempId: optimisticMessage.id,
        filesCount: files?.length || 0
      }
    },
    onSuccess: (data, _, ctx) => {
      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old =>
          old?.map(msg =>
            msg.id === ctx.tempId
              ? {
                  ...data,
                  status: "sent",
                  attachments: fillMissingAttachment(
                    data.attachments,
                    ctx.filesCount
                  )
                }
              : msg
          ) ?? []
      )
    },
    onError: (error, _, context) => {
      if (!context) return

      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old =>
          old?.map(msg =>
            msg.id === context.tempId ? { ...msg, status: "error" } : msg
          ) ?? []
      )
      toast.error(error.message)
      console.log(error)
    }
  })

  return {
    handleSendMessage
  }
}
