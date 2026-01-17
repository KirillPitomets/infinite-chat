import {Message} from "@/prisma/generated/client"
import {prisma} from "../db/prisma"
import {chatService} from "./chat.services"

class MessageService {
  /*
    - get 
    - post
    - update 
    - delete

    **
    - mark as read
  */

  async create({
    authorId,
    chatId,
    content
  }: {
    authorId: string
    chatId: string
    content: string
  }) {
    const chat = await chatService.assertUserInChat(chatId, authorId)

    const message: Message = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: authorId,
        content
      }
    })

    return message
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
