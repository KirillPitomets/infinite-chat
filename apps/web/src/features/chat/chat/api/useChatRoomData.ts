import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../model/chat.keys"
import { ChatRoom } from "@/shared/types/api.type"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"

export function useChatRoomData(chatRoomId: string, initialData: ChatRoom) {
  const api = useApiClient()

  return useQuery<ChatRoom>({
    enabled: !!chatRoomId,
    queryKey: chatKeys.data(chatRoomId),
    queryFn: async () => {
      return await unwrap(
        api.GET("/api/v1/room/{roomId}", {
          params: { path: { roomId: chatRoomId } }
        })
      )
    },
    initialData
  })
}
