import { getServerApiClient } from "@/shared/lib/api/getServerApiClient"
import { unwrap } from "@/shared/lib/api/unwrap"
import { ChatRoom } from "@/shared/types/api.type"

export const getAllChatRooms = async (): Promise<ChatRoom[]> => {
  const api = await getServerApiClient()
  return unwrap(api.GET("/api/v1/room"))
}
