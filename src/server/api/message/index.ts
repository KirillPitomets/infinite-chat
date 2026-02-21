import { userContextMiddleware } from "@/server/middlewares/userContextMiddleware"
import { toChatMessageDTO } from "@/server/api/message/dto/toChatMessageDTO"
import { messageService } from "@/server/api/message/message.service"
import { realtime } from "@/shared/lib/realtime"
import { ChatMessage } from "@/shared/schemes/message.schema"
import Elysia from "elysia"
import { MessageApiSchema } from "./types/message.controller"

export const messagesApi = new Elysia({ prefix: "/message" })
  .use(userContextMiddleware)
  .post(
    "/",
    async ({ userId, body }) => {
      const chatMessage = await messageService.createChatMessage({
        senderId: userId,
        chatId: body.chatId,
        content: body.content
      })

      const dto = toChatMessageDTO(chatMessage)
      await realtime.channel(body.chatId).emit("chat.message.created", dto)
      return dto
    },
    {
      body: MessageApiSchema.create.body,
      response: MessageApiSchema.create.response
    }
  )
  .get(
    "/",
    async ({ query }) => {
      const messages = await messageService.getChatMessages(query.chatId)

      const messagesDTO: ChatMessage[] = messages.map(msg =>
        toChatMessageDTO(msg)
      )

      return messagesDTO
    },
    {
      query: MessageApiSchema.get.query,
      response: MessageApiSchema.get.response
    }
  )
  .get(
    "/latest",
    async ({ query }) => {
      const message = await messageService.getLatestMessage(query.chatId)
      if (!message) {
        return null
      }
      return toChatMessageDTO(message)
    },
    {
      query: MessageApiSchema.getLatest.query,
      response: MessageApiSchema.getLatest.response
    }
  )
  .put(
    "/:messageId",
    async ({ userId, params, body }) => {
      const { updatedMessage, chatId } = await messageService.update({
        userId,
        messageId: params.messageId,
        content: body.content
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
    "/:messageId",
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
