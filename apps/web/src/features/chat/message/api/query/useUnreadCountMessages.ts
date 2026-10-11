import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { useQuery } from "@tanstack/react-query"
import { messageKeys } from "../../model/message.keys"

export const useUnreadCountMessages = (inboxChatId: string) => {
  const api = useApiClient()

  const { data: unreadCount = 0 } = useQuery({
    queryKey: messageKeys.unreadCountMessages(inboxChatId),
    queryFn: async () => {
      const res = await unwrap(
        api.GET("/api/v1/message/unread-count/{roomId}", {
          params: { path: { roomId: inboxChatId } }
        })
      )

      return res.unreadCount
    },
    enabled: !!inboxChatId
  })

  return { unreadCount }
}
