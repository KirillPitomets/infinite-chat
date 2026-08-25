"use client"

import { ChatEmptyState } from "./pages/ChatEmptyState"
import { ChatRoomPage } from "./pages/ChatRoomPage"

type chatPageProps = {
  chatId: string
}

export const ChatPage = ({ chatId }: chatPageProps) => {
  console.log(chatId)
  return (
    <div
      className={` ${chatId ? "max-sm:block" : "max-sm:hidden "} w-full min-h-screen`}
    >
      {chatId ? <ChatRoomPage chatId={chatId} /> : <ChatEmptyState />}
    </div>
  )
}
