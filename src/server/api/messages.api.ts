import Elysia, {t} from "elysia"
import {authMiddleware} from "../middlewares/authMiddleware"
import {messageService} from "../services/message.service"
import {ChatMessageDTO, ChatMessageSchema} from "@/shared/message.schema"
import {toChatMessageDTO} from "../dto/toChatMessageDTO"

export const messagesApi = new Elysia({prefix: "/message"})
  .use(authMiddleware)
  .post(
    "/",
    async ({userId, body}) => {
      const chatMessage = await messageService.createChatMessage({
        senderId: userId,
        chatId: body.chatId,
        content: body.content
      })
      return toChatMessageDTO(chatMessage)
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
    async ({query}) => {
      const messages = await messageService.getChatMessages(query.chatId)

      const messagesDTO: ChatMessageDTO[] = messages.map(msg => toChatMessageDTO(msg))

      return messagesDTO
    },
    {
      query: t.Object({chatId: t.String()}),
      response: t.Array(ChatMessageSchema)
    }
  )
