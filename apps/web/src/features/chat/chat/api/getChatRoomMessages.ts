import { getServerApiClient } from "@/shared/lib/api/getServerApiClient"
import { unwrap } from "@/shared/lib/api/unwrap"

export async function getChatRoomMessages(roomId: string) {
  const api = await getServerApiClient()
  return await unwrap(
    api.GET("/api/v1/message/history/{roomId}", {
      params: { path: { roomId } }
    })
  )
}
