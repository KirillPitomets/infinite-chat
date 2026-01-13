import {
  UserChatPreviewDTO,
  ChatPreviewPrismaType
} from "@/shared/chatPreview.schema"

export const toUserChatPreviewDTO = (
  chats: ChatPreviewPrismaType[]
): UserChatPreviewDTO[] => {
  return chats.map(chat => {
    const message = chat.messages[0]
    const otherUser = chat.memberships[0].user

    return {
      id: chat.id,
      createdAt: chat.createdAt,

      lastMessage: message
        ? {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            senderId: message.senderId
          }
        : null,
      otherUser,
      type: chat.type
    }
  })
}
