import {ChatMessageDTO, ChatMessagePrismaType} from "@/shared/message.schema"

export const toChatMessageDTO = (message: ChatMessagePrismaType): ChatMessageDTO => {
  return {
    id: message.id,
    content: message.content,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      tag: message.sender.tag
    },
    updatedAt: message.updatedAt.toISOString()
  }
}
