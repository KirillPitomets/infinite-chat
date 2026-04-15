import { RefObject, useEffect, useRef } from "react"
import { ChatUIMessage } from "../message/model/message.types"

export const useChatScroll = (
  containerRef: RefObject<HTMLDivElement | null>,
  messages: ChatUIMessage[],
  cb: () => void
) => {
  const isAtElementBottomRef = useRef(false)
  const hasUserInteractedRef = useRef(false)
  const isFirstLoad = useRef(true)
  // ========= AUTOSCROLL FOR FIRST LOAD=========
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (
      isFirstLoad.current &&
      !hasUserInteractedRef.current &&
      messages.length > 0
    ) {
      el.scrollTop = el.scrollHeight
      isFirstLoad.current = false
    }
  }, [messages])

  // ========= AUTOSCROLL =========
  useEffect(() => {
    const el = containerRef.current

    if (!el || !isAtElementBottomRef.current) return

    if (isAtElementBottomRef.current) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  // ========= SCROLL LISTENER =========
  useEffect(() => {
    const el = containerRef.current

    if (!el) return

    const handleScroll = () => {
      hasUserInteractedRef.current = true

      isAtElementBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 50

      if (!isAtElementBottomRef.current) return

      cb()
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])
}
