import { RefObject, useEffect, useRef } from "react"
import { ChatUIMessage } from "../message/model/message.types"

export const useChatScroll = (
  containerRef: RefObject<HTMLDivElement | null>,
  messages: ChatUIMessage[],
  markAsRead: () => void
) => {
  const isAtElementBottomRef = useRef(false)
  const hasUserInteractedRef = useRef(false)
  const isFirstLoad = useRef(true)
  const isScrollable = useRef(false)

  // ========= AUTOSCROLL FOR FIRST LOAD =========
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

  // ========= MARK AS READ IF USER CAN'T SCROLL =========
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    isScrollable.current = el.scrollHeight > el.clientHeight

    if (!isScrollable.current) {
      markAsRead()
    }
  }, [messages.length])

  // ========= AUTOSCROLL =========
  useEffect(() => {
    const el = containerRef.current

    if (!el || !isAtElementBottomRef.current) return

    el.scrollTop = el.scrollHeight
  }, [messages])

  // ========= SCROLL LISTENER =========
  useEffect(() => {
    const el = containerRef.current

    if (!el) return

    const handleScroll = () => {
      hasUserInteractedRef.current = true

      isScrollable.current = el.scrollHeight > el.clientHeight

      isAtElementBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 50

      if (!isAtElementBottomRef.current) return

      markAsRead()
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])
}
