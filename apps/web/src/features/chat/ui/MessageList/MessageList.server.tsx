import { getChatRoomMessages } from "../../chat/api/getChatRoomMessages"
import { MessageList } from "./MessageList"
import { Message } from "@/shared/types/api.type"

type MessageListServerProps = {
  chatId: string
}

export const MessageListServer = async ({ chatId }: MessageListServerProps) => {
  const messages = await getChatRoomMessages(chatId)

  return <MessageList chatId={chatId} initialData={messages} />
}
