import {prisma} from "@/server/db/prisma"
import {userService} from "@/server/services/user.services"
import type {Chat} from "@/prisma/generated/client"

class ChatService {
  async getAll(): Promise<Chat[] | null> {
    const userId = await userService.getDbUserId()

    if (!userId) {
      return null
    }

    const chats = await prisma.chat.findMany({
      where: {memberships: {some: {userId}}}
    })

    if (!chats) {
      throw new Error("No chats")
    }

    return chats
  }

  async getById() {}
}

export const chatService = new ChatService()
