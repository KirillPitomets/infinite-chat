import type {Chat} from "@/prisma/generated/client"
import {prisma} from "@/server/db/prisma"
import {userService} from "@/server/services/user.services"
import {ConflictError, NotFoundError} from "@/server/errors/domain.error"
import {
  ChatPreviewPrismaType,
  UserChatPreviewDTO
} from "@/shared/chatPreview.schema"
import {toUserChatPreviewDTO} from "../dto/toUserChatPreviewDTO"

type createDirectChatBodyType = {
  memberTag: string
}

// todo: make two services direct / group
class ChatService {
  async createDirectChat(
    userId: string,
    body: createDirectChatBodyType
  ): Promise<Chat> {
    const member = await userService.getByTag(body.memberTag)

    if (!member) {
      throw new NotFoundError("Member")
    }

    if (userId === member.id) {
      throw new ConflictError("Cannot create chat with yourself")
    }

    const existsChat: Chat | null = await prisma.chat.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          {memberships: {some: {userId: userId}}},
          {memberships: {some: {userId: member.id}}}
        ]
      }
    })

    if (existsChat) return existsChat

    const chat = await prisma.chat.create({
      data: {
        type: "DIRECT",
        memberships: {
          create: [{userId}, {userId: member.id}]
        }
      }
    })

    return chat
  }

  async getUserChatsPreview(userId: string): Promise<UserChatPreviewDTO[]> {
    const chats: ChatPreviewPrismaType[] = await prisma.chat.findMany({
      where: {memberships: {some: {userId}}},
      select: {
        id: true,
        type: true,
        createdAt: true,
        name: true,
        memberships: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                tag: true,
                lastSeen: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true
          }
        }
      }
    })

    return toUserChatPreviewDTO(chats, userId)
  }

  async getById(userId: string): Promise<Chat> {
    const chat = await prisma.chat.findUnique({
      where: {
        id: userId,
        memberships: {some: {userId}}
      }
    })

    if (!chat) {
      throw new NotFoundError("Chat by id")
    }

    return chat
  }

  async delete(chatId: string) {
    return prisma.chat.delete({where: {id: chatId}})
  }
}

export const chatService = new ChatService()
