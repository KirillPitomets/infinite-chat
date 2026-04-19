import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { useRealtime } from "@/shared/lib/realtime-client"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { ChatMessage } from "@/shared/schemes/message.schema"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { chatKeys } from "../chat/model/chat.keys"
import { messageKeys } from "../message/model/message.keys"

export const useRealtimeInbox = (chats: UserChatPreview[]) => {
  const queryClient = useQueryClient()
  const params = useParams<{ chatId: string }>()
  const user = useCurrentUser()

  return useRealtime({
    channels: ["chats", ...chats.map(chat => chat.id)],
    events: [
      "chat.created",
      "chat.deleted",
      "chat.message.created",
      "chat.message.updated",
      "chat.message.readed"
    ],
    onData: ({ data, event }) => {
      if (event === "chat.created") {
        if (data.memberships.find(member => member.userId === user.id)) {
          queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
            old
              ? old.map(previewChat =>
                  previewChat.id !== data.preview.id
                    ? data.preview
                    : previewChat
                )
              : old
          )
        }
      }

      if (event === "chat.deleted") {
        queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
          old ? old.filter(chat => chat.id !== data.chatId) : old
        )
      }

      if (event === "chat.message.updated") {
        queryClient.setQueryData<ChatMessage>(
          messageKeys.latestMessage(params.chatId),
          data.message
        )
      }

      // set a new value for latest messages
      if (event === "chat.message.created") {
        queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old => {
          if (!old) return old

          const chat = old.find(chat => chat.id === data.chatId)

          if (!chat) return old

          const updatedChat: UserChatPreview = {
            ...chat,
            latestMessage: data.message
          }

          return [
            updatedChat,
            ...old.filter(oldChat => oldChat.id !== data.chatId)
          ]
        })
      }

      if (event === "chat.message.readed") {
        // ========= Clear unreadedCount messages =========
        if (data.userId === user.id) {
          queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
            old
              ? old.map(chat =>
                  chat.id === data.chatId ? { ...chat, unreadCount: 0 } : chat
                )
              : old
          )
        }

        // ========= Change lastReadAt for inbox Chats =========
        if (data.userId !== user.id) {
          queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
            old
              ? old.map(previewChat =>
                  previewChat.id === data.chatId &&
                  previewChat.type === "DIRECT"
                    ? {
                        ...previewChat,
                        otherUser: {
                          ...previewChat.otherUser,
                          lastReadAt: data.lastReadAt
                        }
                      }
                    : previewChat
                )
              : old
          )
        }
      }
    }
  })
}
