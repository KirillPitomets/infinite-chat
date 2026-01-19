import {
  ChatPreviewPrismaType,
  UserChatPreviewDTO
} from "@/shared/chatPreview.schema"

export const toLastMessageDTO = (
  message: ChatPreviewPrismaType["messages"][number] | undefined,
  userId: string
): UserChatPreviewDTO["lastMessage"] | null => {
  if (!message) return null

  return {
    isMine: message.senderId === userId,
    content: message.content,
    createdAt: message.createdAt.toISOString()
  }
}
