import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../model/chat.keys"
import { ChatRoom } from "@/shared/types/api.type"
import { getChatRoomData } from "./getChatRoomData.server"

export function useChatRoomData(chatId: string, initialData: ChatRoom) {
  return useQuery({
    enabled: !!chatId,
    queryKey: chatKeys.data(chatId),
    queryFn: async () => getChatRoomData(chatId),
    initialData
  })
}
