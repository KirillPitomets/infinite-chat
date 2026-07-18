import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { useRealtime } from "@/shared/lib/realtime-client"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { useQueryClient } from "@tanstack/react-query"

export const useRealtimeNav = (chats: UserChatPreview[]) => {
  const user = useCurrentUser()
  const queryClient = useQueryClient()

  useRealtime({
    channels: ["chats", ...chats.map(chat => chat.id)],
    events: ["chat.message.created"],
    onData: ({ data, event }) => {
      // set a new value for urnead messages
      if (event === "chat.message.created") {
        queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old => {
          if (!old) return old

          const chat = old.find(chat => chat.id === data.chatId)

          if (!chat) return old

          const updatedChat: UserChatPreview = {
            ...chat,
            latestMessage: data.message,
            unreadCount:
              data.message.sender.id !== user.id
                ? chat.unreadCount + 1
                : chat.unreadCount
          }

          return [
            updatedChat,
            ...old.filter(oldChat => oldChat.id !== data.chatId)
          ]
        })
      }
    }
  })
}
