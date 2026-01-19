import {
  UserChatPreviewDTO,
  ChatPreviewPrismaType
} from "@/shared/chatPreview.schema"
import {ConflictError} from "../errors/domain.error"
import {toLastMessageDTO} from "./toLastMessageDTO"

export const toUserChatPreviewDTO = (
  chats: ChatPreviewPrismaType[],
  userId: string
): UserChatPreviewDTO[] => {
  return chats.map(chat => {
    const message = chat.messages.at(0)

    switch (chat.type) {
      case "DIRECT":
        const otherUser = chat.memberships.find(
          ({user: member}) => member.id !== userId
        )

        if (!otherUser) {
          throw new ConflictError("Invalid DIRECT chat")
        }

        return {
          id: chat.id,
          type: chat.type,
          createdAt: chat.createdAt.toISOString(),
          otherUser: otherUser.user,
          lastMessage: toLastMessageDTO(message, userId)
        } satisfies UserChatPreviewDTO
      case "GROUP":
        return {
          id: chat.id,
          type: chat.type,
          createdAt: chat.createdAt.toISOString(),
          lastMessage: toLastMessageDTO(message, userId),
          membersCount: chat.memberships.length,
          name: chat.name
        } satisfies UserChatPreviewDTO
      default:
        throw new ConflictError("Unsupported chat type")
    }
  })
}
