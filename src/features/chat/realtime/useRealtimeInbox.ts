import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { useRealtime } from "@/shared/lib/realtime-client"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { ChatMessage } from "@/shared/schemes/message.schema"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { chatKeys } from "../chat/model/chat.keys"
import { messageKeys } from "../message/model/message.keys"

export const useRealtimeInbox = (
  chats: UserChatPreview[],
  refetchChats: () => void
) => {
  const queryClient = useQueryClient()
  const params = useParams<{ chatId: string }>()
  const user = useCurrentUser()

  return useRealtime({
    channels: ["chats", ...chats.map(chat => chat.id)],
    events: [
      "chat.created",
      "chat.deleted",
      "chat.message.created",
      "chat.message.updated"
    ],
    onData: ({ data, event }) => {
      if (event === "chat.created" || event === "chat.deleted") {
        if (data.memberships.find(member => member.userId === user.id)) {
          refetchChats()
        }
      }

      if (event === "chat.message.updated") {
        queryClient.setQueryData<ChatMessage>(
          messageKeys.latestMessage(params.chatId),
          data.message
        )
      }
      // Move chat to top when It got a new message
      if (event === "chat.message.created") {
        queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old => {
          if (!old) return old

          const chat = old.find(chat => chat.id === data.chatId)

          if (!chat) return old
          console.log(data.message)
          const updatedChat: UserChatPreview = {
            ...chat,
            latestMessage: data.message,
            unreadCount:
              params.chatId !== data.chatId &&
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
