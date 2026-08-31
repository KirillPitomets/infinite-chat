import { ChatPage } from "@/features/chat/"
import { getChatRoomData } from "@/features/chat/chat/api/getChatRoomData.server"
import { getChatRoomMessages } from "@/features/chat/chat/api/getChatRoomMessages"
import { ChatRoomPage } from "@/features/chat/pages/ChatRoomPage"
import { MessageListServer } from "@/features/chat/ui/MessageList/MessageList.server"
import { MessageListSkeleton } from "@/features/chat/ui/MessageList/Skeleton"
import { Suspense } from "react"

type ChatPageParams = { params: Promise<{ chatId: string }> }

export default async function Page({ params }: ChatPageParams) {
  const { chatId } = await params
  const room = await getChatRoomData(chatId)
  const messages = await getChatRoomMessages(chatId)

  return (
    <ChatRoomPage
      chatId={chatId}
      chatRoomData={room}
      initialMessages={messages}
    />
  )
}
