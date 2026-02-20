import {prisma} from "../db/prisma"
import {chatService} from "./chat.services"
import {
  ConflictError,
  ForbiddenError,
  NotFoundError
} from "../errors/domain.error"
import {ChatMessagePrismaType} from "../types/ChatMessage.prisma"

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
        updatedAt: true,
        isDeleted: true,
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
        updatedAt: true,
        isDeleted: true,
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
            updatedAt: true,
            isDeleted: true,
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

  async delete(messageId: string, userId: string) {
    const existingMessage = await prisma.message.findUnique({
      where: {id: messageId}
    })

    if (!existingMessage) {
      throw new NotFoundError("Message")
    }

    if (existingMessage.senderId !== userId) {
      throw new ForbiddenError("You can't delete not your message")
    }

    if (existingMessage.isDeleted) {
      throw new ConflictError("Message had been deleted, already")
    }

    const deletedMessage = await prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        isDeleted: true
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        chatId: true,
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

    return deletedMessage
  }

  async update({
    userId,
    messageId,
    content
  }: {
    messageId: string
    userId: string
    content: string
  }): Promise<{updatedMessage: ChatMessagePrismaType; chatId: string}> {
    const existingMessage = await prisma.message.findUnique({
      where: {id: messageId}
    })

    if (!existingMessage) {
      throw new NotFoundError("Message")
    }

    if (existingMessage.senderId !== userId) {
      throw new ForbiddenError("You cannot edit this message")
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        content,
        updatedAt: new Date()
      },
      select: {
        id: true,
        chatId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
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

    return {updatedMessage: updatedMessage, chatId: updatedMessage.chatId}
  }
}

export const messageService = new MessageService()
