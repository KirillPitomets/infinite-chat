import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { useChangeMessageStatus } from "@/features/chat/message/api/useChangeMessageStatus"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { useRealtime } from "@/shared/lib/realtime-client"
import { ChatDetails } from "@/shared/schemes/chat.schema"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { useQueryClient } from "@tanstack/react-query"

export function useRealtimeChat(chatId: string, currentUserId: string) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()

  useRealtime({
    channels: [chatId],
    events: [
      "chat.message.created",
      "chat.message.deleted",
      "chat.message.restored",
      "chat.message.updated",
      "chat.message.readed"
    ],
    onData({ data, event }) {
      switch (event) {
        case "chat.message.created": {
          const message = data.message
          if (message.sender.id === currentUserId) return
          // Change optimistic message to real message in chat
          queryClient.setQueryData<ChatUIMessage[]>(
            chatKeys.messages(data.chatId),
            old => [...(old ?? []), mapAPIMessageToUI(message, "sent", false)]
          )
          break
        }
        case "chat.message.updated": {
          const message = data.message
          if (message.sender.id === currentUserId) return
          // Change message to updated message
          queryClient.setQueryData<ChatUIMessage[]>(
            chatKeys.messages(data.chatId),
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
          if (message.sender.id === currentUserId) return
          changeMessageStatus({
            chatId: data.chatId,
            messageId: message.id,
            status: "deleted"
          })

          break
        }

        case "chat.message.restored": {
          const message = data.message
          if (message.sender.id === currentUserId) return
          changeMessageStatus({
            chatId: data.chatId,
            messageId: message.id,
            status: "sent"
          })

          break
        }

        case "chat.message.readed": {
          if (data.userId === currentUserId) return
          // ========= Change lastReadAt for current chat =========
          queryClient.setQueryData<ChatDetails>(
            chatKeys.data(data.chatId),
            old => {
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
