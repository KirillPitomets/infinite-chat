import Elysia, {t} from "elysia"
import {chatService} from "@/server/services/chat.services"
import {UserChatPreviewSchema} from "../../shared/chatPreview.schema"
import {ChatDetailsSchema} from "@/shared/chat.schema"
import {toUserChatPreviewDTO} from "../dto/toUserChatPreviewDTO"
import {toChatDetailsDTO} from "../dto/toChatDetailsDTO"
import {userContextMiddleware} from "../middlewares/userContextMiddleware"

export const chatApi = new Elysia({prefix: "/chat"})
  .use(userContextMiddleware)
  .post(
    "/create",
    async ({userId, body}) => {
      return await chatService.createDirectChat(userId, body)
    },
    {
      body: t.Object({
        memberTag: t.String()
      })
    }
  )
  .get(
    "/:chatId",
    async ({userId, params}) => {
      const chat = await chatService.getChatDetailsForUser(
        userId,
        params.chatId
      )

      if (!chat) {
        return null
      }

      return toChatDetailsDTO(chat, userId)
    },
    {
      params: t.Object({chatId: t.String()}),
      response: {200: ChatDetailsSchema, 401: t.Null()}
    }
  )
  .get(
    "/preview",
    async ({userId}) => {
      const previewChats = await chatService.getUserChatsPreview(userId)

      const chatsDTO = toUserChatPreviewDTO(previewChats, userId)

      return chatsDTO
    },
    {
      response: {200: t.Array(UserChatPreviewSchema)}
    }
  )
  .delete(
    "/",
    async ({body}) => {
      return await chatService.delete(body.chatId)
    },
    {
      body: t.Object({chatId: t.String()})
    }
  )
