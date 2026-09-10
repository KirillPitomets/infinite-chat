import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { ChatRoom } from "@/shared/types/api.type"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../model/chat.keys"

export function useInboxChats(initialData: ChatRoom[]) {
  const api = useApiClient()

  return useQuery<ChatRoom[]>({
    queryKey: chatKeys.inbox(),
    queryFn: async () => {
      return await unwrap(api.GET("/api/v1/room"))
    },
    initialData,
    initialDataUpdatedAt: Date.now()
  })
}
