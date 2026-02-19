import {Prisma, type Chat} from "@/prisma/generated/client"
import {prisma} from "@/server/db/prisma"
import {userService} from "@/server/services/user.services"
import {
  ConflictError,
  ForbiddenError,
  NotFoundError
} from "@/server/errors/domain.error"
import {ChatDetailsPrismaType} from "../types/ChatDetails.prisma"
import {ChatPreviewPrismaType} from "../types/UserChatPreview.prisma"

type createDirectChatBodyType = {
  memberTag: string
}

type ChatPrismaType = Prisma.ChatGetPayload<{
  select: {
    name: true
    id: true
    imageUrl: true
    createdAt: true
    type: true
    memberships: {
      select: {
        userId: true
      }
    }
  }
}>

class ChatService {
  async createDirectChat(
    userId: string,
    body: createDirectChatBodyType
  ): Promise<ChatPrismaType> {
    const member = await userService.getByTag(body.memberTag)

    if (!member) {
      throw new NotFoundError("Member")
    }

    if (userId === member.id) {
      throw new ConflictError("Cannot create chat with yourself")
    }

    const existsChat: ChatPrismaType | null = await prisma.chat.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          {memberships: {some: {userId: userId}}},
          {memberships: {some: {userId: member.id}}}
        ]
      },
      select: {
        name: true,
        id: true,
        imageUrl: true,
        createdAt: true,
        type: true,
        memberships: {
          select: {
            userId: true
          }
        }
      }
    })

    if (existsChat) {
      throw new ConflictError(`You already have chat with ${body.memberTag}`)
    }

    const chat: ChatPrismaType = await prisma.chat.create({
      data: {
        type: "DIRECT",
        memberships: {
          create: [{userId}, {userId: member.id}]
        }
      },
      select: {
        name: true,
        id: true,
        imageUrl: true,
        createdAt: true,
        type: true,
        memberships: {
          select: {
            userId: true
          }
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
    const chats = await prisma.chat.findMany({
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
                lastSeen: true,
                imageUrl: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {createdAt: "desc"},
          include: {
            sender: {
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

    return chats
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
    return prisma.chat.delete({
      where: {id: chatId},
      select: {memberships: {select: { userId: true }}}
    })
  }
}

export const chatService = new ChatService()
