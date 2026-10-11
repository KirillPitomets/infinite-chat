"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ContextMenuItem } from "./useMessageContextMenu"

type MessageContextMenuProps = {
  position: { x: number; y: number }
  items: ContextMenuItem[]
  onClose: () => void
}

export default function MessageContextMenu({
  position,
  items,
  onClose
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      console.log("close")
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 180),
    y: Math.min(position.y, window.innerHeight - items.length * 36 - 16)
  }

  return (
    <ul
      ref={menuRef}
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      className="fixed z-50 min-w-[160px] rounded-md bg-white dark:bg-zinc-800 shadow-lg py-1 text-sm"
    >
      {items.map(item => (
        <li
          key={item.label}
          onClick={() => {
            item.onClick()
            onClose()
          }}
          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${
            item.danger ? "text-red-500" : ""
          }`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}
