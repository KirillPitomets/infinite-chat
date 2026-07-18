import { Chat } from "@/shared/schemes/chat.schema"
import { ChatPrismaType } from "../types/chat.prisma"

export const toChatDTO = (chat: ChatPrismaType): Chat => {
  return {
    id: chat.id,
    imageUrl: chat.imageUrl,
    createdAt: chat.createdAt.toISOString(),
    memberships: chat.memberships,
    name: chat.name,
    type: chat.type
  }
}
