import Elysia, {t} from "elysia"
import {messageService} from "../services/message.service"
import {ChatMessageDTO, ChatMessageSchema} from "@/shared/message.schema"
import {toChatMessageDTO} from "../dto/toChatMessageDTO"
import {userContextMiddleware} from "../middlewares/userContextMiddleware"

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
      return toChatMessageDTO(chatMessage, userId)
    },
    {
      body: t.Object({
        chatId: t.String(),
        content: t.String()
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
      query: t.Object({chatId: t.String()}),
      response: t.Array(ChatMessageSchema)
    }
  )
  .get(
    "/lastMessage",
    async ({query, userId}) => {
      const message = await messageService.getLastMessageFromChat(query.chatId)
      if (!message) {
        return null
      }
      return toChatMessageDTO(message, userId)
    },
    {
      query: t.Object({chatId: t.String()}),
      response: t.Union([ChatMessageSchema, t.Null()])
    }
  )
