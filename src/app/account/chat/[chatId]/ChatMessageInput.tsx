"use client"

import {edenClient} from "@/lib/eden"
import {useMutation, useQuery} from "@tanstack/react-query"
import {useParams} from "next/navigation"
import {useEffect, useState} from "react"

export function ChatMessageInput() {
  const params = useParams()
  const [value, setValue] = useState<string>("")

  const {
    data: message,
    mutate: sendMessage,
    isPending
  } = useMutation({
    mutationKey: ["sendMessageToChat"],
    mutationFn: async () => {
      if (params.chatId && value) {
        return await edenClient.message.post({
          chatId: params.chatId,
          content: value
        })
      }
    }
  })

  return (
    <label className="flex items-center border-t border-zinc-300 py-1 px-4 space-x-2">
      <input
        onChange={e => setValue(e.target.value)}
        value={value}
        className="w-full px-4 py-2.5 bg-zinc-50 rounded-2xl transition-colors focus:bg-zinc-200"
        type="text"
        placeholder="Message..."
        disabled={isPending}
      />

      <button
        onClick={() => sendMessage()}
        className="text-green-600 font-semibold text-nowrap rounded-2xl px-2 py-4 transition-colors cursor-pointer hover:bg-green-500 hover:text-white"
        disabled={isPending}
      >
        Send message
      </button>
    </label>
  )
}
