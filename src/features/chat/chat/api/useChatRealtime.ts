import { useRealtime } from "@/shared/lib/realtime-client"
import { useQueryClient } from "@tanstack/react-query"
import { chatKeys } from "../model/chat.keys"
import { useChangeMessageStatus } from "@/features/chat/message/api/useChangeMessageStatus"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"

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
              old => [...(old ?? []), mapAPIMessageToUI(data, "sent", false)]
            )
            break
          case "chat.message.updated":
            queryClient.setQueryData<ChatUIMessage[]>(
              chatKeys.messages(chatId),
              old =>
                old
                  ? old.map(msg =>
                      msg.id === data.id
                        ? mapAPIMessageToUI(data, "sent", false)
                        : msg
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
