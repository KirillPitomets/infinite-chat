import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { fillMissingAttachment } from "@/features/chat/message/utils/fillMissingAttachments"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { MessageSocket } from "@/shared/lib/socket/socketFactory"
import { uploadToCloudinary } from "@/shared/lib/upload/uploadToCloudinary"
import {
  CreateMessageAttachmentDto,
  CreateMessageDto,
  MessageAttachments
} from "@/shared/types/api.type"
import { CloudinaryUploadResponse } from "@/shared/types/cloudinary.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"

function defineResourceType(
  type: Pick<CloudinaryUploadResponse, "resource_type">
) {
  switch (type.resource_type) {
    case "image":
      return "IMAGE"
    case "raw":
      return "FILE"
    case "video":
      return "VIDEO"
  }
}

export function useSendMessage(chatId: string, socket: MessageSocket | null) {
  const [replyMessage, setReplyMessage] = useState<ChatUIMessage | undefined>(
    undefined
  )
  const [isReplyMessage, setIsReplyMessage] = useState(false)
  const queryClient = useQueryClient()
  const currentUser = useCurrentUser()
  const api = useApiClient()

  const clearReplyMessage = () => {
    setIsReplyMessage(false)
    setReplyMessage(undefined)
  }

  const handleReplyMessage = (msg: ChatUIMessage) => {
    setIsReplyMessage(true)
    setReplyMessage(msg)
  }

  const { mutate: handleSendMessage } = useMutation<
    ChatUIMessage,
    Error,
    Omit<CreateMessageDto, "attachments"> & { files?: File[] },
    { previousMessages: ChatUIMessage[]; tempId: string; filesCount?: number }
  >({
    mutationKey: chatKeys.sendMessages(chatId),
    mutationFn: async ({ roomId, text, files, replyToMessageId }) => {
      if (!text && !files) {
        throw new Error("Failed to send message")
      }
      const attachments: CreateMessageAttachmentDto[] = []

      if (files) {
        for (let file of files) {
          const slot = await unwrap(
            api.POST("/api/v1/message/attachments/presign/{roomId}", {
              params: { path: { roomId: chatId } }
            })
          )

          const { public_id, display_name, bytes, resource_type, secure_url } =
            await uploadToCloudinary(slot, file)

          attachments.push({
            key: public_id,
            name: display_name,
            size: bytes,
            type: defineResourceType({ resource_type }),
            url: secure_url
          })
        }
      }

      if (!socket) {
        throw new Error("Invalid socket")
      }

      const msg = await socket.timeout(5000).emitWithAck("message.send", {
        roomId: chatId,
        text,
        replyToMessageId,
        attachments
      })

      return mapAPIMessageToUI(msg, "sent", false)
    },

    onMutate: async ({ text, files, replyToMessageId }) => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      })

      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>(chatKeys.messages(chatId)) ??
        []

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
      if (!context) return

      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old =>
          old?.map(msg =>
            msg.id === context.tempId ? { ...msg, status: "error" } : msg
          ) ?? []
      )

      toast.error(error.message)
    }
  })

  return {
    handleSendMessage,
    handleReplyMessage,
    clearReplyMessage,
    isReplyMessage,
    replyMessage
  }
}
