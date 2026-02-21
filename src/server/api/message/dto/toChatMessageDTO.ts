import { ChatMessage } from "@/shared/schemes/message.schema"
import { ChatMessagePrismaType } from "@/server/api/message/types/message.prisma"

export const toChatMessageDTO = (
  message: ChatMessagePrismaType
): ChatMessage => {
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
