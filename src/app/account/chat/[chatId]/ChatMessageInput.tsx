"use client"

export function ChatMessageInput() {
  
  return (
    <label className="flex items-center border-t border-zinc-300 py-1 px-4 space-x-2">
      <input
        className="w-full px-4 py-2.5 bg-zinc-50 rounded-2xl transition-colors focus:bg-zinc-200"
        type="text"
        placeholder="Message..."
      />
      <button className="text-green-600 font-semibold text-nowrap rounded-2xl px-2 py-4 transition-colors cursor-pointer hover:bg-green-500 hover:text-white">
        Send message
      </button>
    </label>
  )
}
