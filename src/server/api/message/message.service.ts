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
import { fileStorageService } from "../fileStorage/fileStorage.service"

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
    files?: File[]
  }): Promise<ChatMessagePrismaType> {
    const chat = await chatService.assertUserInChat(chatId, senderId)

    if (!content && (!files || files.length === 0)) {
      throw new ConflictError("Message must have content or files")
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
        const uploaded = await fileStorageService.uploadMessageFiles(files)

        await tx.attachment.createMany({
          data: uploaded.map(att => ({ messageId: createdMessage.id, ...att }))
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
    content,
    files
  }: {
    messageId: string
    userId: string
    content?: string
    files?: File[]
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

    if (!content && (!files || files.length === 0)) {
      throw new ConflictError("Message must have content or attachments")
    }

    const updatedMessage = await prisma.$transaction(async tx => {
      if (content) {
        await tx.message.update({
          where: { id: messageId },
          data: { content }
        })
      }

      if (files && files.length > 0) {
        const oldAttachments = await tx.attachment.findMany({
          where: { messageId }
        })
        // delete old attachments in DB
        await tx.attachment.deleteMany({ where: { messageId } })
        // delete old attachments in FileStorage
        const attachmentsKeys: string[] = oldAttachments.map(att => att.key)
        // Create and save new files
        const uploaded = await fileStorageService.uploadMessageFiles(files)

        const updatedAttachments = await tx.attachment.createMany({
          data: uploaded.map(att => ({
            messageId,
            ...att
          }))
        })

        // Delete files from storage If user have been updated successfully
        if (updatedAttachments) {
          const resultOfDeletionFilesInStorage =
            await fileStorageService.deleteByKeys(attachmentsKeys)

          if (!resultOfDeletionFilesInStorage) {
            console.log(
              `Files ${attachmentsKeys.map(att => att + ", ")} not deleted from File Storage`
            )
          }
        }
      }

      return tx.message.findUniqueOrThrow({
        where: { id: existingMessage.id },
        include: ChatMessageInclude
      })
    })

    return { updatedMessage, chatId: updatedMessage.id }
  }
}

export const messageService = new MessageService()
