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

      const dto = toChatMessageDTO(chatMessage, userId)

      await realtime.channel(body.chatId).emit("chat.message.created", dto)
      console.log(dto)
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
        toChatMessageDTO(msg, userId)
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

      const dto = toChatMessageDTO(updatedMessage, userId)

      await realtime.channel(chatId).emit("chat.message.updated", dto)

      return dto
    },
    {
      body: z.object({content: z.string()}),
      response: ChatMessageSchema
    }
  )
  .delete("/:messageId", async () => {})

  .get(
    "/latest",
    async ({query, userId}) => {
      const message = await messageService.getLatestMessage(query.chatId)
      if (!message) {
        return null
      }
      return toChatMessageDTO(message, userId)
    },
    {
      query: z.object({chatId: z.string()}),
      response: z.union([ChatMessageSchema, z.null()])
    }
  )
