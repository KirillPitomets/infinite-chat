import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { edenClient } from "@/shared/lib/eden"
import { ChatUIMessage } from "@/features/chat/model/chat.types"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chatKeys } from "./chat.key"

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient()
  const currentUser = useCurrentUser()

  return useMutation<
    ChatUIMessage,
    Error,
    string,
    { previousMessages: ChatUIMessage[]; tempId: string }
  >({
    mutationKey: chatKeys.sendMessages(chatId),
    mutationFn: async (content: string) => {
      const res = await edenClient.message.post({
        content,
        chatId
      })

      if (!res.data) {
        throw new Error("Failed to send message")
      }

      return { ...res.data, status: "sent" }
    },

    onMutate: async content => {
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
        status: "sending"
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
