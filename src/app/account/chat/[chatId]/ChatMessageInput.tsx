"use client"

import {useState} from "react"

type ChatMessageInputProps = {
  handleMessage: (message: string) => void
  isPending: boolean
}

export function ChatMessageInput({
  handleMessage,
  isPending
}: ChatMessageInputProps) {
  const [value, setValue] = useState<string>("")



  return (
    <label className="flex items-center border-t border-zinc-300 py-1 px-4 space-x-2">
      <input
        onChange={e => setValue(e.target.value)}
        value={value}
        className="w-full px-4 py-2.5 text-zinc-900 bg-zinc-50 rounded-2xl transition-colors focus:bg-zinc-200"
        type="text"
        placeholder="Message..."
        disabled={isPending}
      />

      <button
        onClick={() => {
          handleMessage(value)
          setValue("")
        }}
        className="text-green-600 font-semibold text-nowrap rounded-2xl px-2 py-4 transition-colors cursor-pointer hover:bg-green-500 hover:text-white"
        disabled={isPending}
      >
        Send message
      </button>
    </label>
  )
}
