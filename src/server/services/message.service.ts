import {realtime} from "@/lib/realtime"
import {prisma} from "../db/prisma"
import {chatService} from "./chat.services"
import {ChatMessagePrismaType} from "@/shared/message.schema"
import {NotFoundError} from "../errors/domain.error"

class MessageService {
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

    const msg = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: senderId,
        content
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            tag: true,
            imageUrl: true
          }
        }
      }
    })

    await realtime.channel(chatId).emit("chat.message", null)

    return msg
  }

  async getChatMessages(chatId: string): Promise<ChatMessagePrismaType[]> {
    return await prisma.message.findMany({
      where: {
        chatId
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            tag: true,
            imageUrl: true
          }
        }
      }
    })
  }

  async getLatestMessage(
    chatId: string
  ): Promise<ChatMessagePrismaType | null> {
    const chat = await prisma.chat.findUnique({
      where: {id: chatId},
      select: {
        messages: {
          take: 1,
          orderBy: {createdAt: "desc"},
          select: {
            id: true,
            content: true,
            createdAt: true,
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

    if (!chat) {
      throw new NotFoundError("Chat")
    }

    return chat.messages[0] || null
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
