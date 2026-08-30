import { useEffect } from "react"
import { Message } from "@/shared/types/api.type"
import { useMessagesSocket } from "../providers/socketProvider"

export const useNewMessage = (
  chatRoomId: string,
  onMessage: (msg: Message) => void
) => {
  const messageSocket = useMessagesSocket()

  useEffect(() => {
    if (!messageSocket) return

    const handler = (msg: Message) => {
      if (msg.roomId === chatRoomId) onMessage(msg)
    }

    messageSocket.on("message.created", handler)
    return () => void messageSocket.off("message.created", handler)
  }, [messageSocket, chatRoomId, onMessage])

  return {
    handleSendMessage: () => {
      if (!messageSocket) return

      messageSocket.emit("message.send", "hello")
    }
  }
}
