import { getChatRoomData } from "@/features/chat/chat/api/getChatRoomData.server"
import { getChatRoomMessages } from "@/features/chat/chat/api/getChatRoomMessages"
import { ChatRoomPage } from "@/features/chat/pages/ChatRoomPage"

type ChatPageParams = { params: Promise<{ chatId: string }> }

export default async function Page({ params }: ChatPageParams) {
  const { chatId } = await params
  const room = await getChatRoomData(chatId)
  const messages = await getChatRoomMessages(chatId)

  return (
    <ChatRoomPage
      chatId={chatId}
      initialChatRoomData={room}
      initialMessages={messages}
    />
  )
}
