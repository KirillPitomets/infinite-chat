import {
  UserChatPreviewDTO,
  ChatPreviewPrismaType
} from "@/shared/chatPreview.schema"
import {ConflictError} from "../errors/domain.error"

export const toUserChatPreviewDTO = (
  chats: ChatPreviewPrismaType[],
  currentUserId: string
): UserChatPreviewDTO[] => {
  return chats.map(chat => {
    const message = chat.messages.at(0)
    const lastMessage = message
      ? {
          isMine: message.senderId === currentUserId,
          content: message.content,
          createdAt: message.createdAt.toString()
        }
      : null

    switch (chat.type) {
      case "DIRECT":
        const otherUser = chat.memberships.find(
          ({user: member}) => member.id !== currentUserId
        )

        if (!otherUser) {
          throw new ConflictError("Invalid DIRECT chat")
        }

        return {
          id: chat.id,
          type: chat.type,
          createdAt: chat.createdAt.toString(),
          otherUser: otherUser.user,
          lastMessage: lastMessage
        } satisfies UserChatPreviewDTO
      case "GROUP":
        return {
          id: chat.id,
          type: chat.type,
          createdAt: chat.createdAt.toString(),
          lastMessage: lastMessage,
          membersCount: chat.memberships.length,
          nameOfGroup: chat.name
        } satisfies UserChatPreviewDTO
    }
  })
}
