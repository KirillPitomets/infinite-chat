import { type Chat, ChatUser } from "@/prisma/generated/client"
import { prisma } from "@/server/db/prisma"
import {
  ConflictError,
  ForbiddenError,
  NotFoundError
} from "@/server/errors/domain.error"
import {
  chatDeleteInclude,
  ChatDeletePrismaType,
  chatDetailsInclude,
  ChatDetailsPrismaType,
  chatInclude,
  chatPreviewInclude,
  ChatPreviewPrismaType,
  ChatPrismaType
} from "@/server/api/chat/types/chat.prisma"
import { userService } from "@/server/api/user/user.services"

class ChatService {
  async createDirectChat(
    userId: string,
    memberTag: string
  ): Promise<ChatPrismaType> {
    const member = await userService.getByTag(memberTag)

    if (!member) {
      throw new NotFoundError("Member")
    }

    if (userId === member.id) {
      throw new ConflictError("Cannot create chat with yourself")
    }

    const existsChat = await prisma.chat.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          { memberships: { some: { userId: userId } } },
          { memberships: { some: { userId: member.id } } }
        ]
      },
      include: chatInclude
    })

    if (existsChat) return existsChat

    const chat = await prisma.chat.create({
      data: {
        type: "DIRECT",
        memberships: {
          create: [{ userId }, { userId: member.id }]
        }
      },
      include: chatInclude
    })

    return chat
  }

  async getChatDetailsForUser(
    userId: string,
    chatId: string
  ): Promise<ChatDetailsPrismaType> {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        memberships: {
          some: { userId }
        }
      },
      include: chatDetailsInclude
    })

    if (!chat) {
      throw new NotFoundError(`Chat with id: ${chatId} not found`)
    }

    // ==========
    // Update lastReadAt
    await prisma.chatUser.update({
      where: { userId_chatId: { userId, chatId } },
      data: {
        lastReadAt: new Date()
      }
    })

    return chat
  }

  async getUserChatsPreview(userId: string): Promise<ChatPreviewPrismaType[]> {
    const memberships = await prisma.chatUser.findMany({
      where: { userId },
      include: {
        chat: {
          include: chatPreviewInclude
        }
      }
    })

    if (!memberships.length) {
      throw new NotFoundError("Chats")
    }

    return Promise.all(
      memberships.map(async membership => {
        return {
          ...membership.chat,
          unreadCount: await this.getCountUnreadMessages(
            userId,
            membership.chatId,
            membership.lastReadAt
          )
        }
      })
    )
  }

  async getCountUnreadMessages(
    userId: string,
    chatId: string,
    lastReadAt: Date
  ): Promise<number> {
    return prisma.message.count({
      where: {
        chatId: chatId,
        senderId: { not: userId },
        createdAt: {
          gt: lastReadAt ?? new Date(0)
        }
      }
    })
  }

  async assertUserInChat(
    userId: string,
    chatId: string
  ): Promise<Pick<Chat, "id">> {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        memberships: { some: { userId } }
      },
      select: {
        id: true
      }
    })

    if (!chat) {
      throw new ForbiddenError("Your are not a chat member")
    }

    return chat
  }

  async getParticants(userId: string, chatId: string): Promise<ChatUser[]> {
    const chatExist = await prisma.chat.findUnique({ where: { id: chatId } })

    if (!chatExist) {
      throw new NotFoundError("Chat")
    }

    await this.assertUserInChat(userId, chatId)

    const participants = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { memberships: true }
    })

    if (!participants) {
      throw new NotFoundError("Particants")
    }

    return participants.memberships
  }

  async delete(userId: string, chatId: string): Promise<ChatDeletePrismaType> {
    const chatExist = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { memberships: { select: { userId: true } } }
    })

    if (!chatExist) {
      throw new NotFoundError("Chat")
    }

    if (!chatExist.memberships.some(u => u.userId !== userId)) {
      throw new ForbiddenError("You are not a chat member")
    }

    const deletedChat = await prisma.chat.delete({
      where: { id: chatId, memberships: { some: { userId } } },
      include: chatDeleteInclude
    })

    return deletedChat
  }
}

export const chatService = new ChatService()
