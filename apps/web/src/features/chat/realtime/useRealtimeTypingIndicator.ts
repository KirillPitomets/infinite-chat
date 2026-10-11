import { PresenceSocket } from "@/shared/lib/socket/socketFactory"
import { PresenceEventMap } from "@/shared/types/socket/presence.events"
import { useCallback, useEffect, useRef, useState } from "react"

export const useRealtimeTypingIndicator = (
  chatId: string,
  presenceSocket: PresenceSocket | null,
  TYPING_TTL: number = 2_000
) => {
  const [typingUserIds, setTypingUserIds] = useState<string[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const remove = useCallback((userId: string) => {
    clearTimeout(timers.current.get(userId))
    timers.current.delete(userId)
    setTypingUserIds(prev => prev.filter(typingId => typingId !== userId))
  }, [])

  useEffect(() => {
    if (!presenceSocket) return
    const map = timers.current

    const onTyping = ({
      chatRoomId,
      userId
    }: PresenceEventMap["presence.typing"]) => {
      if (chatRoomId !== chatId) return
      clearTimeout(map.get(userId))
      map.set(
        userId,
        setTimeout(() => remove(userId), TYPING_TTL)
      )
      setTypingUserIds(prev =>
        prev.includes(userId) ? prev : [...prev, userId]
      )
      console.log(typingUserIds)
    }

    presenceSocket.on("presence.typing", onTyping)

    return () => {
      presenceSocket.off("presence.typing", onTyping)
      map.forEach(clearTimeout)
      map.clear()
      setTypingUserIds([])
    }
  }, [remove, presenceSocket])

  return { typingUserIds, removeTyping: remove }
}
