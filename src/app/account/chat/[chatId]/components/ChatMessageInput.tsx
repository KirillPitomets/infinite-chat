"use client"

import {ChangeEvent, useLayoutEffect, useRef, useState} from "react"

export function ChatMessageInput({
  sendFn
}: {
  sendFn: (content: string) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState<string>("")

  const MIN_TEXTAREA_HEIGHT = 32

  const abjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "unset"
      textareaRef.current.style.height = `${Math.max(
        MIN_TEXTAREA_HEIGHT,
        textareaRef.current.scrollHeight
      )}px`
    }
  }

  useLayoutEffect(abjustHeight, [value])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const sendMessageHandler = () => {
    if (value.trim().length > 0 && value.trim().length < 1000) {
      sendFn(value)
      textareaRef.current?.focus()
      setValue("")
    }
  }

  const sendMessageViaEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault()
        if (value.trim()) {
          sendMessageHandler()
        }
      }
    }
  }

  return (
    <label className="flex items-end border-t border-zinc-300 py-1 pb-5 px-4 space-x-2 relative">
      <textarea
        ref={textareaRef}
        onKeyDown={sendMessageViaEnter}
        onChange={onChange}
        value={value}
        className="w-full max-h-62.5 px-4 py-2.5 text-zinc-900 bg-zinc-50 rounded-2xl transition-colors focus:bg-zinc-200 resize-none"
        autoFocus
        rows={1}
        placeholder="Message..."
      />

      <button
        onClick={sendMessageHandler}
        className="text-green-600 font-semibold text-nowrap rounded-2xl px-2 py-4 transition-colors cursor-pointer hover:bg-green-500 hover:text-white"
        disabled={!value.trim()}
      >
        Send
      </button>
    </label>
  )
}
