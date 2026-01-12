import type {Chat} from "@/prisma/generated/client"
import {prisma} from "@/server/db/prisma"
import {userService} from "@/server/services/user.services"
import {ConflictError, NotFoundError} from "@/server/errors/domain.error"

type createChatBodyType = {
  memberTag: string
}

class ChatService {
  async create(userId: string, body: createChatBodyType): Promise<Chat> {
    const member = await userService.getByTag(body.memberTag)

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

  async getAll(userId: string): Promise<Chat[]> {
    const chats = await prisma.chat.findMany({
      where: {memberships: {some: {userId}}},
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!chats) {
      throw new NotFoundError("Chats")
    }

    return []
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

/*
id: "chat-1",
name: "John Doe",
photo: "https://randomuser.me/api/portraits/men/11.jpg",
lastMessage: "How are you?",
messageCreatedAt: 1640881380,
*/
