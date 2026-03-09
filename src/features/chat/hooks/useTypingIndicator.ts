import { useCallback, useRef } from "react"

export const useTypingIndicator = (
  sendTyping: (isTyping: boolean) => void,
  delay: number = 2000
) => {
  const isTypingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTyping = useCallback(() => {
    // If user isn't typing mode - send true
    if (!isTypingRef.current) {
      sendTyping(true)
      isTypingRef.current = true
    }

    // Clear timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Set timeout for cancel typing mode
    timerRef.current = setTimeout(() => {
      sendTyping(false)
      isTypingRef.current = false
    }, delay)
  }, [sendTyping, delay])

  return handleTyping
}
