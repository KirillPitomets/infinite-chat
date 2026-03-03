import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { ConflictError } from "../../../errors/domain.error"
import {
  ChatMessage,
  messageAttachmentsMapper
} from "@/shared/schemes/message.schema"
import { ChatPreviewPrismaType } from "../types/chat.prisma"

export const toUserChatPreviewDTO = (
  chats: ChatPreviewPrismaType[],
  userId: string
): UserChatPreview[] => {
  return chats.map(chat => {
    const latestMessageObj = chat.messages[0]

    const latestMessage = latestMessageObj
      ? ({
          id: latestMessageObj.id,
          content: latestMessageObj.content,
          sender: latestMessageObj.sender,
          isDeleted: latestMessageObj.isDeleted,
          attachments: messageAttachmentsMapper(latestMessageObj.attachments),
          createdAt: latestMessageObj.createdAt.toISOString(),
          updatedAt: latestMessageObj.updatedAt.toISOString()
        } satisfies ChatMessage)
      : null

    switch (chat.type) {
      case "DIRECT":
        const otherUser = chat.memberships.find(
          ({ user: member }) => member.id !== userId
        )

        if (!otherUser) {
          throw new ConflictError("Invalid DIRECT chat")
        }

        return {
          id: chat.id,
          type: chat.type,
          latestMessage,
          createdAt: chat.createdAt.toISOString(),
          otherUser: {
            id: otherUser.user.id,
            imageUrl: otherUser.user.imageUrl,
            name: otherUser.user.name,
            tag: otherUser.user.tag,
            lastSeen: otherUser.user.lastSeen.toISOString()
          }
        } satisfies UserChatPreview
      case "GROUP":
        return {
          id: chat.id,
          type: chat.type,
          latestMessage,
          createdAt: chat.createdAt.toISOString(),
          membersCount: chat.memberships.length,
          name: chat.name
        } satisfies UserChatPreview
      default:
        throw new ConflictError("Unsupported chat type")
    }
  })
}
