import { useRealtime } from "@/shared/lib/realtime-client"
import { useQueryClient } from "@tanstack/react-query"
import { chatKeys } from "../chat.key"
import { useChangeMessageStatus } from "@/features/chat/api/message/useChangeMessageStatus"
import { ChatUIMessage } from "@/features/chat/model/chat.types"

export function useChatRealtime(chatId: string, userId: string) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()

  useRealtime({
    channels: [chatId],
    events: [
      "chat.message.created",
      "chat.message.deleted",
      "chat.message.updated"
    ],
    onData({ data, event }) {
      if (data.sender.id !== userId) {
        switch (event) {
          case "chat.message.created":
            queryClient.setQueryData<ChatUIMessage[]>(
              chatKeys.messages(chatId),
              old => [
                ...(old ?? []),
                {
                  ...data,
                  status: "sent"
                }
              ]
            )
            break
          case "chat.message.updated":
            queryClient.setQueryData<ChatUIMessage[]>(
              chatKeys.messages(chatId),
              old =>
                old
                  ? old.map(msg =>
                      msg.id === data.id ? { ...data, status: "sent" } : msg
                    )
                  : []
            )
            break
          case "chat.message.deleted":
            changeMessageStatus({
              chatId,
              messageId: data.id,
              status: "deleted"
            })

            break

          default:
            break
        }
      }
    }
  })
}
