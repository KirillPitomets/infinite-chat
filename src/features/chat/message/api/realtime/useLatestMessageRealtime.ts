import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { useRealtime } from "@/shared/lib/realtime-client"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { ChatMessage } from "@/shared/schemes/message.schema"
import { useQueryClient } from "@tanstack/react-query"

export const useLatestsMessageRealtime = (chatId: string) => {
  const queryClient = useQueryClient()

  useRealtime({
    channels: [chatId],
    events: [
      "chat.message.created",
      "chat.message.updated",
      "chat.message.deleted"
    ],
    onData({ data, event }) {
      if (
        event === "chat.message.created" ||
        event === "chat.message.updated"
      ) {
        queryClient.setQueryData<ChatMessage>(["latestMessage", chatId], data.message)
      }

      if (event === "chat.message.created") {
        queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old => {
          if (!old) return old

          const chat = old.find(chat => chat.id === chatId)

          if (!chat) return old

          const updatedChat = { ...chat, latestMessage: data.message }

          return [updatedChat, ...old.filter(oldChat => oldChat.id !== chatId)]
        })
      }
    }
  })
}
