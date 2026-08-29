import { getChatRoomData } from "./chat/api/getChatRoomData.server"
import { ChatRoomPage } from "./pages/ChatRoomPage"

type chatPageProps = {
  chatId: string
}

export const ChatPage = async ({ chatId }: chatPageProps) => {
  const room = await getChatRoomData(chatId)
  return (
    <div className={"max-sm:block  w-full min-h-screen"}>
      <ChatRoomPage chatId={chatId} chatRoomData={room} />
    </div>
  )
}
