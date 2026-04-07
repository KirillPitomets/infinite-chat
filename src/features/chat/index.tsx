"use client"

import { useParams } from "next/navigation"
import ChatLayout from "@/features/chat/ui/ChatLayout"
import { ChatRoomPage } from "./pages/ChatRoomPage"
import { ChatEmptyState } from "./pages/ChatEmptyState"

export const ChatPage = () => {
  const params = useParams()
  const chatId = params?.chatId as string | undefined

  return (
    <ChatLayout>
      <div
        className={` ${params ? "max-sm:block" : "max-sm:hidden "} w-full min-h-screen`}
      >
        {chatId ? <ChatRoomPage chatId={chatId} /> : <ChatEmptyState />}
      </div>
    </ChatLayout>
  )
}
