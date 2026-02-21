import { edenClient } from "@/shared/lib/eden"
import { ChatUIMessage } from "@/features/chat/model/chat.types"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "./chat.key"

export function useGetMessages(chatId: string) {
  return useQuery<ChatUIMessage[]>({
    enabled: !!chatId,
    queryKey: chatKeys.messages(chatId),
    queryFn: async () => {
      const res = await edenClient.message.get({
        query: { chatId: chatId }
      })

      if (!res.data) {
        throw new Error("Failed to get messages")
      }

      return res.data.map(msg => ({
        ...msg,
        status: "sent"
      }))
    }
  })
}
