import { getServerApiClient } from "@/shared/lib/api/getServerApiClient"
import { unwrap } from "@/shared/lib/api/unwrap"
import { ChatRoom } from "@/shared/types/api.type"

export async function getChatRoomData(roomId: string): Promise<ChatRoom> {
  const api = await getServerApiClient()
  return await unwrap(
    api.GET("/api/v1/room/{roomId}", { params: { path: { roomId } } })
  )
}
