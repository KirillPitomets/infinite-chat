import { toChatMessageDTO } from "@/server/api/message/dto/toChatMessageDTO"
import { messageService } from "@/server/api/message/message.service"
import { userContextMiddleware } from "@/server/middlewares/userContextMiddleware"
import { realtime } from "@/shared/lib/realtime"
import { ChatMessage } from "@/shared/schemes/message.schema"
import Elysia from "elysia"
import { MessageApiSchema } from "./types/message.controller"

export const messagesApi = new Elysia()
  .use(userContextMiddleware)
  .post(
    "/chat/:chatId/messages",
    async ({ userId, params, body }) => {
      const files: File[] | undefined = body.files
        ? Array.isArray(body.files)
          ? body.files
          : [body.files]
        : undefined

      const chatMessage = await messageService.createChatMessage({
        senderId: userId,
        chatId: params.chatId,
        content: body.content,
        files
      })

      const dto = toChatMessageDTO(chatMessage)
      await realtime.channel(params.chatId).emit("chat.message.created", dto)
      return dto
    },
    {
      body: MessageApiSchema.create.body,
      response: MessageApiSchema.create.response,
      type: "multipart/form-data"
    }
  )
  .get(
    "/chat/:chatId/messages",
    async ({ params }) => {
      const messages = await messageService.getChatMessages(params.chatId)

      const messagesDTO: ChatMessage[] = messages.map(msg =>
        toChatMessageDTO(msg)
      )

      return messagesDTO
    },
    {
      response: MessageApiSchema.get.response
    }
  )
  .get(
    "/chat/:chatId/message/latest",
    async ({ params }) => {
      const message = await messageService.getLatestMessage(params.chatId)
      if (!message) {
        return null
      }
      return toChatMessageDTO(message)
    },
    {
      response: MessageApiSchema.getLatest.response
    }
  )
  .put(
    "/messages/:messageId",
    async ({ userId, params, body }) => {
      const files: File[] | undefined = body.files
        ? Array.isArray(body.files)
          ? body.files
          : [body.files]
        : undefined

      const { updatedMessage, chatId } = await messageService.update({
        userId,
        messageId: params.messageId,
        content: body.content,
        files
      })

      const dto = toChatMessageDTO(updatedMessage)

      await realtime.channel(chatId).emit("chat.message.updated", dto)

      return dto
    },
    {
      body: MessageApiSchema.put.body,
      response: MessageApiSchema.put.response
    }
  )
  .delete(
    "/messages/:messageId",
    async ({ params, userId }) => {
      const deletedMessage = await messageService.delete(
        params.messageId,
        userId
      )

      const dtoDeletedMessage = toChatMessageDTO(deletedMessage)

      await realtime
        .channel(deletedMessage.chatId)
        .emit("chat.message.deleted", dtoDeletedMessage)

      return dtoDeletedMessage
    },
    {
      response: MessageApiSchema.delete.response
    }
  )
