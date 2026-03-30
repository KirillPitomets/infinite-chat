import {
  ChatMessage,
  messageAttachmentsMapper
} from "@/shared/schemes/message.schema"
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
    replyToMessage: message.replyToMessage
      ? {
          id: message.replyToMessage.id,
          content: message.replyToMessage.content,
          sender: {
            id: message.replyToMessage.sender.id,
            imageUrl: message.replyToMessage.sender.imageUrl,
            name: message.replyToMessage.sender.name,
            tag: message.replyToMessage.sender.tag
          }
        }
      : undefined,
    attachments: messageAttachmentsMapper(message.attachments) || [],
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString()
  }
}
