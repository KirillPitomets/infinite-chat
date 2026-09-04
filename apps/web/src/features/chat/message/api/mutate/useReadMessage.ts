import { ChatRoomSocket } from "@/shared/lib/socket/socketFactory"
import { UpdateRoomMemberLastReadAtDto } from "@/shared/types/api.type"
import { currentUser } from "@clerk/nextjs/server"
import { useMutation } from "@tanstack/react-query"
import { ChatUIMessage } from "../../model/message.types"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"

export const useReadMessages = (
  roomChatId: string,
  chatRoomSocket: ChatRoomSocket | null,
  messages: ChatUIMessage[]
) => {
  const sender = useCurrentUser()

  const { mutate } = useMutation({
    mutationFn: async () => {
      const lastIncomingMessage = [...messages]
        .slice()
        .reverse()
        .find(msg => msg.sender.id !== sender.id)

      if (!lastIncomingMessage || lastIncomingMessage.sender.id === sender.id) {
        return
      }

      if (!chatRoomSocket) {
        throw new Error("Invalid socket")
      }
      chatRoomSocket.emit("room.update-member-read-at", {
        roomId: roomChatId,
        lastReadAt: lastIncomingMessage.createdAt
      } as UpdateRoomMemberLastReadAtDto)
    }
  })

  return {
    readMessages: mutate
  }
}
