import { PresenceSocket } from "@/shared/lib/socket/socketFactory"
import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"

export const usePresenceTyping = (
  chatId: string,
  socket: PresenceSocket | null
) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!socket) return
      socket.emit("presence.typing", { roomId: chatId })
    }
  })
  const lastEmit = useRef(0)
  const onInputChange = () => {
    const now = Date.now()
    if (now - lastEmit.current < 2_000) return
    lastEmit.current = now
    mutate()
  }

  return { onInputChange }
}
