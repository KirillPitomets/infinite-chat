import { useChangeMessageStatus } from "@/features/chat/message/api/useChangeMessageStatus"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { useRealtime } from "@/shared/lib/realtime-client"
import { useQueryClient } from "@tanstack/react-query"
import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { ChatDetails } from "@/shared/schemes/chat.schema"

export function useRealtimeChat(chatId: string, userId: string) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()

  useRealtime({
    channels: [chatId],
    events: [
      "chat.message.created",
      "chat.message.deleted",
      "chat.message.updated",
      "chat.message.readed"
    ],
    onData({ data, event }) {
      switch (event) {
        case "chat.message.created": {
          const message = data.message
          if (message.sender.id === userId) break
          // Change optimistic message to real message in chat
          queryClient.setQueryData<ChatUIMessage[]>(
            chatKeys.messages(chatId),
            old => [...(old ?? []), mapAPIMessageToUI(message, "sent", false)]
          )
          break
        }
        case "chat.message.updated": {
          const message = data.message
          if (message.sender.id === userId) break
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
        }
        case "chat.message.deleted": {
          const message = data.message
          if (message.sender.id === userId) break
          changeMessageStatus({
            chatId,
            messageId: message.id,
            status: "deleted"
          })

          break
        }
        case "chat.message.readed": {
          queryClient.setQueryData<ChatDetails>(
            chatKeys.data(data.chatId),
            old => {
              console.log("================================")
              console.log("================================")
              console.log("Event chat.message.readed - 67 line")
              console.log("================================")
              console.log("================================")
              if (old && old.type === "DIRECT") {
                return {
                  ...old,
                  otherUser: { ...old.otherUser, lastReadAt: data.lastReadAt }
                }
              }

              return old
            }
          )

          break
        }

        default:
          break
      }
    }
  })
}
