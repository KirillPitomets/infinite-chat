import { edenClient } from "@/shared/lib/eden"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../chat.key"

export function useChatData(chatId: string) {
  return useQuery({
    queryKey: chatKeys.data(chatId),
    queryFn: async () => {
      const res = await edenClient.chat({ chatId }).get()
      return res.data
    },
    enabled: !!chatId
  })
}
