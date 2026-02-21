import {ChatMessageDTO} from "@/shared/schemes/message.schema"
import {ChatMessagePrismaType} from "../types/ChatMessage.prisma"

export const toChatMessageDTO = (
  message: ChatMessagePrismaType,
): ChatMessageDTO => {
  return {
    id: message.id,
    content: message.content,
    isDeleted: message.isDeleted,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      tag: message.sender.tag,
      imageUrl: message.sender.imageUrl
    },
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString()
  }
}
