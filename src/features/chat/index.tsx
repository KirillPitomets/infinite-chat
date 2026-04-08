"use client"

import { useParams } from "next/navigation"
import ChatLayout from "@/features/chat/ui/ChatLayout"
import { ChatRoomPage } from "./pages/ChatRoomPage"
import { ChatEmptyState } from "./pages/ChatEmptyState"

export const ChatPage = () => {
  const {chatId} = useParams<{chatId: string}>()

  return (
    <ChatLayout>
      <div
        className={` ${chatId ? "max-sm:block" : "max-sm:hidden "} w-full min-h-screen`}
      >
        {chatId ? <ChatRoomPage chatId={chatId} /> : <ChatEmptyState />}
      </div>
    </ChatLayout>
  )
}
