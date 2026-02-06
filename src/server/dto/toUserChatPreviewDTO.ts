import {UserChatPreviewDTO} from "@/shared/chatPreview.schema"
import {ConflictError} from "../errors/domain.error"
import {ChatPreviewPrismaType} from "../types/UserChatPreview.prisma"

export const toUserChatPreviewDTO = (
  chats: ChatPreviewPrismaType[],
  userId: string
): UserChatPreviewDTO[] => {
  return chats.map(chat => {
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
          otherUser: {
            id: otherUser.user.id,
            imageUrl: otherUser.user.imageUrl,
            name: otherUser.user.name,
            tag: otherUser.user.tag,
            lastSeen: otherUser.user.lastSeen.toISOString()
          }
        } satisfies UserChatPreviewDTO
      case "GROUP":
        return {
          id: chat.id,
          type: chat.type,
          createdAt: chat.createdAt.toISOString(),
          membersCount: chat.memberships.length,
          name: chat.name
        } satisfies UserChatPreviewDTO
      default:
        throw new ConflictError("Unsupported chat type")
    }
  })
}
