import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { edenClient } from "@/shared/lib/eden"
import { ChatUIMessage } from "@/features/chat/model/chat.types"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chatKeys } from "../chat.key"
import { useUploadThing } from "@/shared/utils/uploadthing"
import { MessageAttachment } from "@/shared/schemes/message.schema"

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient()
  const currentUser = useCurrentUser()

  const { startUpload } = useUploadThing("chatUploadImage")

  return useMutation<
    ChatUIMessage,
    Error,
    { content: string; files?: File[] },
    { previousMessages: ChatUIMessage[]; tempId: string }
  >({
    mutationKey: chatKeys.sendMessages(chatId),
    mutationFn: async ({ content, files }) => {
      const filesUploaded = files?.length ? await startUpload(files) : []

      const formatted: MessageAttachment[] = filesUploaded
        ? filesUploaded.map(file => ({
            key: file.key,
            name: file.name,
            size: file.size,
            url: file.ufsUrl,
            type: "IMAGE",
            height: 0,
            width: 0
          }))
        : []

      const res = await edenClient.message.post({
        chatId,
        content,
        files: formatted
      })

      if (!res.data) {
        throw new Error("Failed to send message")
      }

      return { ...res.data, status: "sent" }
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
          ? files.map(file => ({
              key: "",
              name: "",
              size: 0,
              type: "IMAGE",
              url: ""
            }))
          : []
      }

      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old => [...(old ?? []), optimisticMessage]
      )

      return { previousMessages, tempId }
    },
    onSuccess: (data, _, ctx) => {
      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old =>
          old?.map(msg =>
            msg.id === ctx.tempId ? { ...data, status: "sent" } : msg
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
