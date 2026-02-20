import {realtime} from "@/lib/realtime"
import {ChatMessageDTO, ChatMessageSchema} from "@/shared/message.schema"
import Elysia from "elysia"
import z from "zod"
import {toChatMessageDTO} from "../dto/toChatMessageDTO"
import {userContextMiddleware} from "../middlewares/userContextMiddleware"
import {messageService} from "../services/message.service"

export const messagesApi = new Elysia({prefix: "/message"})
  .use(userContextMiddleware)
  .post(
    "/",
    async ({userId, body}) => {
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
      body: z.object({
        chatId: z.string(),
        content: z.string().max(2000)
      }),
      response: ChatMessageSchema
    }
  )
  .get(
    "/",
    async ({query, userId}) => {
      const messages = await messageService.getChatMessages(query.chatId)

      const messagesDTO: ChatMessageDTO[] = messages.map(msg =>
        toChatMessageDTO(msg)
      )

      return messagesDTO
    },
    {
      query: z.object({chatId: z.string()}),
      response: z.array(ChatMessageSchema)
    }
  )
  .put(
    "/:messageId",
    async ({userId, params, body}) => {
      const {updatedMessage, chatId} = await messageService.update({
        userId,
        messageId: params.messageId,
        content: body.content
      })

      const dto = toChatMessageDTO(updatedMessage)

      await realtime.channel(chatId).emit("chat.message.updated", dto)

      return dto
    },
    {
      body: z.object({content: z.string()}),
      response: ChatMessageSchema
    }
  )
  .delete(
    "/:messageId",
    async ({params, userId}) => {
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
      response: ChatMessageSchema
    }
  )

  .get(
    "/latest",
    async ({query, userId}) => {
      const message = await messageService.getLatestMessage(query.chatId)
      if (!message) {
        return null
      }
      return toChatMessageDTO(message)
    },
    {
      query: z.object({chatId: z.string()}),
      response: z.union([ChatMessageSchema, z.null()])
    }
  )
