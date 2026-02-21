import { ChatUIMessage } from "@/features/chat/model/chat.types"
import { useQueryClient } from "@tanstack/react-query"
import { chatKeys } from "./chat.key"

interface useChangeMessageArgs extends Pick<ChatUIMessage, "status"> {
  chatId: string
  messageId: string
}

export function useChangeMessageStatus() {
  const queryClient = useQueryClient()

  return ({ chatId, status, messageId }: useChangeMessageArgs) =>
    queryClient.setQueryData<ChatUIMessage[]>(
      chatKeys.messages(chatId),
      old =>
        old
          ? old.map(msg => (msg.id === messageId ? { ...msg, status } : msg))
          : []
    )
}
