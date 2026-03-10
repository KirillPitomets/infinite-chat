import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { useQueryClient } from "@tanstack/react-query"
import { useRealtime } from "@upstash/realtime/client"

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
        queryClient.setQueryData(["latestMessage", chatId], data)
      }

      if (event === "chat.message.created") {
        queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old => {
          if (!old) return old

          const chat = old.find(chat => chat.id === chatId)

          if (!chat) return old

          const updatedChat = { ...chat, latestMessage: data }

          return [updatedChat, ...old.filter(oldChat => oldChat.id !== chatId)]
        })
      }
    }
  })
}
