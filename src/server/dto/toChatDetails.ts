import {ChatDetailsDTO, ChatDetailsPrismaType} from "@/shared/chat.schema"
import {ConflictError} from "../errors/domain.error"

const mapMessages = (
  messages: ChatDetailsPrismaType["messages"]
): ChatDetailsDTO["messages"] => {
  return messages.map(msg => ({
    id: msg.id,
    sender: {
      id: msg.sender.id,
      name: msg.sender.name,
      tag: msg.sender.tag
    },
    content: msg.content,
    createdAt: msg.createdAt.toISOString()
  }))
}

export const toChatDetailsDTO = (
  chat: ChatDetailsPrismaType,
  userId: string
): ChatDetailsDTO => {
  switch (chat.type) {
    case "DIRECT":
      const otherUser = chat.memberships.find(
        member => member.user.id != userId
      )?.user

      if (!otherUser) {
        throw new ConflictError("Invalid DIRECT chat")
      }

      return {
        id: chat.id,
        type: chat.type,
        createdAt: chat.createdAt.toISOString(),
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          tag: otherUser.tag
        },
        messages: chat.messages ? mapMessages(chat.messages) : []
      }
    case "GROUP":
      return {
        id: chat.id,
        type: chat.type,
        createdAt: chat.createdAt.toISOString(),
        name: chat.name,
        membersCount: chat.memberships.length,
        messages: chat.messages ? mapMessages(chat.messages) : []
      }
    default:
      throw new ConflictError("Unsupported chat type")
  }
}
