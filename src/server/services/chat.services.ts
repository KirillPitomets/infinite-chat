import type {Chat} from "@/prisma/generated/client"
import {prisma} from "@/server/db/prisma"
import {userService} from "@/server/services/user.services"
import {
  ConflictError,
  ForbiddenError,
  NotFoundError
} from "@/server/errors/domain.error"
import {ChatPreviewPrismaType} from "@/shared/chatPreview.schema"
import {ChatDetailsPrismaType} from "@/shared/chat.schema"

type createDirectChatBodyType = {
  memberTag: string
}

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

  async getChatDetailsForUser(
    userId: string,
    chatId: string
  ): Promise<ChatDetailsPrismaType> {
    const chat: ChatDetailsPrismaType | null = await prisma.chat.findUnique({
      where: {
        id: chatId,
        memberships: {
          some: {userId}
        }
      },
      select: {
        id: true,
        type: true,
        name: true,
        createdAt: true,
        imageUrl: true,

        memberships: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                tag: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    if (!chat) {
      throw new NotFoundError(`Chat with id: ${chatId} not found`)
    }

    return chat
  }

  async getUserChatsPreview(userId: string): Promise<ChatPreviewPrismaType[]> {
    return await prisma.chat.findMany({
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
            createdAt: true,
            sender: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
  }

  async assertUserInChat(
    chatId: string,
    userId: string
  ): Promise<Pick<Chat, "id">> {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        memberships: {some: {userId}}
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

  async delete(chatId: string) {
    return prisma.chat.delete({where: {id: chatId}})
  }
}

export const chatService = new ChatService()
