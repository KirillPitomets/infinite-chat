import {ChatDetailsDTO, ChatDetailsPrismaType} from "@/shared/chat.schema"
import {ConflictError} from "../errors/domain.error"


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
          tag: otherUser.tag,
          imageUrl: otherUser.imageUrl
        }
      }
    case "GROUP":
      return {
        id: chat.id,
        type: chat.type,
        createdAt: chat.createdAt.toISOString(),
        name: chat.name,
        membersCount: chat.memberships.length,
        imageUrl: chat.imageUrl,
      }
    default:
      throw new ConflictError("Unsupported chat type")
  }
}
