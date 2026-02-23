import { edenClient } from "@/shared/lib/eden"
import { ChatUIMessage } from "@/features/chat/model/chat.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chatKeys } from "../chat.key"

type useUpdateMessageArgs = {
  chatId: string
  cancelUpdate: () => void
}

export function useUpdateMessage({
  chatId,
  cancelUpdate
}: useUpdateMessageArgs) {
  const queryClient = useQueryClient()

  return useMutation<
    ChatUIMessage,
    Error,
    { messageId: string; content: string },
    { previousMessages: ChatUIMessage[] }
  >({
    mutationFn: async ({ messageId, content }) => {
      const res = await edenClient.message({ messageId }).put({ content })

      if (res.status !== 200 || !res.data) {
        throw new Error(res.error?.value.message ?? "Failed to update message")
      }

      return { ...res.data, status: "sent" }
    },
    onMutate: async ({ messageId, content }) => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      })
      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>([
          "getChatMessages",
          chatId
        ]) ?? []

      // optimistic update
      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old =>
          old
            ? old.map(msg =>
                msg.id === messageId
                  ? { ...msg, content, status: "editing" }
                  : msg
              )
            : []
      )

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
