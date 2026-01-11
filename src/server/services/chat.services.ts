import {prisma} from "@/server/db/prisma"
import {userService} from "@/server/services/user.services"
import type {Chat} from "@/prisma/generated/client"

type createChatBodyType = {
  body: {
    memberTag: string
  }
}

class ChatService {
  async create({body}: createChatBodyType) {
    const currentUserId = await userService.getDbUserId()

    if (!currentUserId || !body.memberTag) {
      throw new Error("No user or member tag")
    }

    const member = await userService.getByTag(body.memberTag)

    if (!member) {
      throw new Error("Member not found")
    }

    if (currentUserId === member.id) {
      throw new Error("Cannot create chat with yourself")
    }

    const memberExists = await userService.getById(member.id)

    if (!memberExists) {
      throw new Error("User not found")
    }

    const existsChat = await prisma.chat.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          {memberships: {some: {userId: currentUserId }}},
          {memberships: {some: {userId: member.id}}}
        ]
      }
    })

    if (existsChat) return existsChat

    const chat = await prisma.chat.create({
      data: {
        type: "DIRECT",
        memberships: {
          create: [{userId: currentUserId}, {userId: member.id}]
        }
      }
    })

    return chat
  }

  async getAll(): Promise<Chat[] | null> {
    const currentUserId = await userService.getDbUserId()

    if (!currentUserId) {
      return null
    }

    const chats = await prisma.chat.findMany({
      where: {memberships: {some: {userId: currentUserId}}},
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    console.log()

    if (!chats) {
      throw new Error("No chats")
    }


    

    return []
  }

  async getById(id: string): Promise<Chat | null> {
    const userId = await userService.getDbUserId()

    if (!userId) {
      return null
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id,
        memberships: {some: {userId}}
      }
    })

    if (!chat) {
      return null
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
