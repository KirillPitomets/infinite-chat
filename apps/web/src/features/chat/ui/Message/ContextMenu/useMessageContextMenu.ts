import { ChatUIMessage } from "@/features/chat/message/model/message.types"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { RefObject, useState } from "react"
import toast from "react-hot-toast"

export type ContextMenuItem = {
  label: string
  onClick: () => void
  danger?: boolean
}

type useMessageContextMenuParams = {
  messages: ChatUIMessage[]
  containerRef: RefObject<HTMLDivElement | null>
  onReplyToMessage: (msg: ChatUIMessage) => void
  onUpdate: (msg: ChatUIMessage) => void
  onDelete: (messageId: string) => void
}

export const useMessageContextMenu = ({
  containerRef,
  messages,
  onDelete,
  onReplyToMessage,
  onUpdate
}: useMessageContextMenuParams) => {
  const [contextMenu, setContextMenu] = useState<{
    messageId: string
    position: { x: number; y: number }
  } | null>(null)
  const currentUser = useCurrentUser()

  const lockScroll = () => {
    const el = containerRef.current
    if (!el) return
    const scrollbarWidth = el.offsetWidth - el.clientWidth
    const currentPaddingRight = parseFloat(getComputedStyle(el).paddingRight)
    el.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`
    el.style.overflowY = "hidden"
  }

  const unlockScroll = () => {
    const el = containerRef.current
    if (!el) return
    el.style.paddingRight = ""
    el.style.overflowY = "auto"
  }

  const handleContextMenu = (e: MouseEvent, message: ChatUIMessage) => {
    e.preventDefault()
    lockScroll()
    setContextMenu({
      messageId: message.id,
      position: { x: e.clientX, y: e.clientY }
    })
  }

  const handleCloseContextMenu = () => {
    unlockScroll()
    setContextMenu(null)
  }

  const activeMessage = messages.find(m => m.id === contextMenu?.messageId)

  const getMenuItems = (message: ChatUIMessage) => {
    const isMine = currentUser.id === message.sender.id
    const items: ContextMenuItem[] = [
      { label: "Reply", onClick: () => onReplyToMessage(message) }
    ]

    if (message.text) {
      items.push({
        label: "Copy",
        onClick: () => {
          navigator.clipboard.writeText(message.text || "")
          toast.success("Copied!")
        }
      })
    }

    if (isMine) {
      items.push(
        { label: "Edit", onClick: () => onUpdate(message) },
        { label: "Delete", onClick: () => onDelete(message.id), danger: true }
      )
    }
    return items
  }

  return {
    handleContextMenu,
    handleCloseContextMenu,
    contextMenu,
    activeMessage,
    getMenuItems
  }
}
