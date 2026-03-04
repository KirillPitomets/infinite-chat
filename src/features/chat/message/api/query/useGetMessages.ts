import { edenClient } from "@/shared/lib/eden"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "@/features/chat/chat/model/chat.keys"

export function useGetMessages(chatId: string) {
  return useQuery<ChatUIMessage[]>({
    enabled: !!chatId,
    queryKey: chatKeys.messages(chatId),
    queryFn: async () => {
      const res = await edenClient.chat({ chatId }).messages.get({
        query: { chatId: chatId }
      })

      if (!res.data) {
        throw new Error("Failed to get messages")
      }

      return res.data.map(msg => mapAPIMessageToUI(msg, "sent", false))
    }
  })
}
