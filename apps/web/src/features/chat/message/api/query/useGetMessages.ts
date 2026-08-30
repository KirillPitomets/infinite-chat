import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { Message } from "@/shared/types/api.type"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"

export function useGetMessages(chatId: string, initialData: Message[]) {
  const api = useApiClient()

  return useQuery<Message[]>({
    enabled: !!chatId,
    queryKey: chatKeys.messages(chatId),
    queryFn: async () =>
      await unwrap(
        api.GET("/api/v1/message/history/{roomId}", {
          params: { path: { roomId: chatId } }
        })
      ),

    initialData
  })
}
