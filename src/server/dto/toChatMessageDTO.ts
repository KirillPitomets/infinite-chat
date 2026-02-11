
import {ChatMessageDTO} from "@/shared/message.schema"
import { ChatMessagePrismaType } from "../types/ChatMessage.prisma"

export const toChatMessageDTO = (
  message: ChatMessagePrismaType,
  userId: string
): ChatMessageDTO => {
  return {
    id: message.id,
    content: message.content,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      tag: message.sender.tag,
      imageUrl: message.sender.imageUrl
    },
    isMine: userId === message.sender.id,
    createdAt: message.createdAt.toISOString()
  }
}
