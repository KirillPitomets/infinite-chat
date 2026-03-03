import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { edenClient } from "@/shared/lib/eden"

import { fillMissingAttachment } from "@/features/chat/message/utils/fillMissingAttachments"
import { MessageAttachment } from "@/shared/schemes/message.schema"
import { useUploadThing } from "@/shared/utils/uploadthing"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { formatUploadedFiles } from "../../utils/formatUploadedFiles"

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient()
  const currentUser = useCurrentUser()

  const { startUpload } = useUploadThing("chatUploadImage")

  return useMutation<
    ChatUIMessage,
    Error,
    { content: string; files?: File[] },
    { previousMessages: ChatUIMessage[]; tempId: string; filesCount?: number }
  >({
    mutationKey: chatKeys.sendMessages(chatId),
    mutationFn: async ({ content, files }) => {
      const filesUploaded = files?.length ? await startUpload(files) : []

      const formattedAttachments: MessageAttachment[] = filesUploaded
        ? formatUploadedFiles(filesUploaded)
        : []

      const res = await edenClient.message.post({
        chatId,
        content,
        files: formattedAttachments
      })

      if (!res.data) {
        throw new Error("Failed to send message")
      }

      return mapAPIMessageToUI(res.data, "sent", false)
    },

    onMutate: async ({ content, files }) => {
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
        content,
        sender: currentUser,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "loading",
        attachments: files
          ? files.map(_ => ({
              key: `temp-${Date.now()}-missingAttachment`,
              name: "temp-attachment",
              size: 0,
              type: "VIDEO",
              url: "",
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
}
