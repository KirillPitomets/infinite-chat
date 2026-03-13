import { useChangeMessageStatus } from "@/features/chat/message/api/useChangeMessageStatus"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { useRealtime } from "@/shared/lib/realtime-client"
import { useQueryClient } from "@tanstack/react-query"
import { chatKeys } from "@/features/chat/chat/model/chat.keys"

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
      const message = data.message

      if (message.sender.id !== userId) {
        switch (event) {
          case "chat.message.created":
            // Change optimistic message to real message in chat
            queryClient.setQueryData<ChatUIMessage[]>(
              chatKeys.messages(chatId),
              old => [...(old ?? []), mapAPIMessageToUI(message, "sent", false)]
            )
            break
          case "chat.message.updated":
            // Change message to updated message
            queryClient.setQueryData<ChatUIMessage[]>(
              chatKeys.messages(chatId),
              old =>
                old
                  ? old.map(msg =>
                      msg.id === message.id
                        ? mapAPIMessageToUI(message, "sent", false)
                        : msg
                    )
                  : []
            )
            break
          case "chat.message.deleted":
            changeMessageStatus({
              chatId,
              messageId: message.id,
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
