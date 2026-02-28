import { prisma } from "@/server/db/prisma"
import {
  ConflictError,
  ForbiddenError,
  NotFoundError
} from "@/server/errors/domain.error"
import { chatService } from "@/server/api/chat/chat.service"
import {
  ChatMessageInclude,
  ChatMessagePrismaType
} from "@/server/api/message/types/message.prisma"
import { MessageAttachment } from "@/shared/schemes/message.schema"

class MessageService {
  async createChatMessage({
    senderId,
    chatId,
    content,
    files
  }: {
    senderId: string
    chatId: string
    content: string
    files?: MessageAttachment[]
  }): Promise<ChatMessagePrismaType> {
    const chat = await chatService.assertUserInChat(chatId, senderId)

    if (!content && (!files || files.length === 0)) {
      throw new ConflictError("Message must have content or attachments")
    }

    const message = await prisma.$transaction(async tx => {
      const createdMessage = await tx.message.create({
        data: {
          chatId: chat.id,
          senderId,
          content
        }
      })

      if (files && files.length > 0) {
        await tx.attachment.createMany({
          data: files.map(file => ({
            messageId: createdMessage.id,
            key: file.key,
            name: file.name,
            size: file.size,
            type: file.type,
            width: file.width,
            height: file.height,
            url: file.url
          }))
        })
      }

      return tx.message.findUniqueOrThrow({
        where: { id: createdMessage.id },
        include: ChatMessageInclude
      })
    })

    return message
  }

  async getChatMessages(chatId: string): Promise<ChatMessagePrismaType[]> {
    const messages = await prisma.message.findMany({
      where: {
        chatId
      },
      include: ChatMessageInclude
    })

    return messages
  }

  async getLatestMessage(
    chatId: string
  ): Promise<ChatMessagePrismaType | null> {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: ChatMessageInclude
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
      where: { id: messageId }
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
      include: ChatMessageInclude
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
  }): Promise<{ updatedMessage: ChatMessagePrismaType; chatId: string }> {
    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId }
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
      include: ChatMessageInclude
    })

    return { updatedMessage: updatedMessage, chatId: updatedMessage.chatId }
  }
}

export const messageService = new MessageService()
