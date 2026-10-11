import { useQuery } from "@tanstack/react-query"
import { ChatUIMessage, mapAPIMessageToUI } from "../../model/message.types"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"

export const useGetLatestMessage = (chatId: string) => {
  const api = useApiClient()

  const { data: latestMessage } = useQuery<ChatUIMessage>({
    queryKey: ["latest", "message", chatId],
    queryFn: async () => {
      const res = await unwrap(
        api.GET("/api/v1/message/history/{roomId}", {
          params: {
            path: { roomId: chatId },
            query: { limit: 1 }
          }
        })
      )
      return mapAPIMessageToUI(res[0], "sent", false)
    }
  })

  return { latestMessage }
}
