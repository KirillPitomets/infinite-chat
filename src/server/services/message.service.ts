import {prisma} from "../db/prisma"
import {chatService} from "./chat.services"
import {ChatMessagePrismaType} from "@/shared/message.schema"

class MessageService {
  /*
    **
    - mark as read
  */

  async createChatMessage({
    senderId,
    chatId,
    content
  }: {
    senderId: string
    chatId: string
    content: string
  }): Promise<ChatMessagePrismaType> {
    const chat = await chatService.assertUserInChat(chatId, senderId)

    return await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: senderId,
        content
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            tag: true
          }
        }
      }
    })
  }

  async getChatMessages(chatId: string): Promise<ChatMessagePrismaType[]> {
    return await prisma.message.findMany({
      where: {
        chatId
      },
      select: {
        id: true,
        content: true,
        updatedAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            tag: true
          }
        }
      }
    })
  }

  async delete(messageId: string, userId: string) {}

  async update({
    messageId,
    userId,
    content
  }: {
    messageId: string
    userId: string
    content: string
  }) {}
}

export const messageService = new MessageService()
