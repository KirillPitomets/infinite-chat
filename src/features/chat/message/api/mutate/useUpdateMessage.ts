import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { edenClient } from "@/shared/lib/eden"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chatKeys } from "../../../chat/model/chat.keys"
import { useChangeMessageStatus } from "../useChangeMessageStatus"

type useUpdateMessageArgs = {
  chatId: string
  cancelUpdate: () => void
}

export function useUpdateMessage({
  chatId,
  cancelUpdate
}: useUpdateMessageArgs) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()

  return useMutation<
    ChatUIMessage,
    Error,
    {
      messageId: string
      content?: string
      files?: File[]
    },
    { previousMessages: ChatUIMessage[] }
  >({
    mutationFn: async ({ messageId, content, files }) => {
      const res = await edenClient
        .messages({ messageId })
        .put({ content, files })

      if (res.status !== 200 || !res.data) {
        throw new Error(res.error?.value.message ?? "Failed to update message")
      }

      return mapAPIMessageToUI(res.data, "sent", false)
    },
    onMutate: async ({ messageId }) => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      })

      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>([
          "getChatMessages",
          chatId
        ]) ?? []

      changeMessageStatus({ chatId, messageId, status: "loading" })

      return { previousMessages }
    },
    onSuccess: data => {
      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old => old?.map(msg => (msg.id === data.id ? data : msg)) ?? []
      )
      toast.success("Message have been updated")
      cancelUpdate()
    },
    onError: (error, _, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(chatId),
          context.previousMessages
        )
      }

      toast.error(error.message)
      cancelUpdate()
    }
  })
}
