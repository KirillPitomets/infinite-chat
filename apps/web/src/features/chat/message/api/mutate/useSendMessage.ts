import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { fillMissingAttachment } from "@/features/chat/message/utils/fillMissingAttachments"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { MessageSocket } from "@/shared/lib/socket/socketFactory"
import { CreateMessageDto, Message } from "@/shared/types/api.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import { Socket } from "socket.io-client"

export type SubmitMessageArgs = {
  text?: string
  files?: File[]
  replyMessage?: ChatUIMessage
}

export function useSendMessage(chatId: string, socket: MessageSocket | null) {
  const [replyMessage, setReplyMessage] = useState<ChatUIMessage | undefined>(
    undefined
  )
  const [isReplyMessage, setIsReplyMessage] = useState(false)
  const queryClient = useQueryClient()
  const currentUser = useCurrentUser()

  const clearReplyMessage = () => {
    setIsReplyMessage(false)
    setReplyMessage(undefined)
  }

  const { mutate: handleSendMessage } = useMutation<
    ChatUIMessage,
    Error,
    SubmitMessageArgs,
    { previousMessages: ChatUIMessage[]; tempId: string; filesCount?: number }
  >({
    mutationKey: chatKeys.sendMessages(chatId),
    mutationFn: async ({ text, files, replyMessage }) => {
      if (!text && !files) {
        throw new Error("Failed to send message")
      }

      if (!socket) {
        throw new Error("Invalid socket")
      }

      const msg = await socket.timeout(5000).emitWithAck("message.send", {
        roomId: chatId,
        text,
        replyToMessageId: replyMessage?.id
      })

      return mapAPIMessageToUI(msg, "sent", false)
    },

    onMutate: async ({ text, files, replyMessage }) => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      })

      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>([
          "getChatMessages",
          chatId
        ]) ?? []

      const tempId = crypto.randomUUID()
      const optimisticMessage: ChatUIMessage = {
        id: tempId,
        roomId: chatId,
        type: "USER",
        text,
        sender: currentUser,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "loading",
        replyToMessage: replyMessage,
        attachments: files
          ? files.map(_ => ({
              id: "",
              key: `temp-${Date.now()}-missingAttachment`,
              name: "temp-attachment",
              size: 123,
              type: "VIDEO",
              url: "",
              createdAt: "",

              isError: false
            }))
          : []
      }

      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old => [...(old ?? []), optimisticMessage]
      )

      return { previousMessages, tempId, filesCount: files?.length || 0 }
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
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(chatId),
          context.previousMessages ?? []
        )
      }

      toast.error(error.message)
    }
  })

  return {
    handleSendMessage,
    setReplyMessage,
    setIsReplyMessage,
    clearReplyMessage,
    isReplyMessage,
    replyMessage
  }
}
