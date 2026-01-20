import Elysia, {t} from "elysia"
import {chatService} from "@/server/services/chat.services"
import {UserChatPreviewSchema} from "../../shared/chatPreview.schema"
import {ChatDetailsSchema} from "@/shared/chat.schema"
import {toUserChatPreviewDTO} from "../dto/toUserChatPreviewDTO"
import {toChatDetailsDTO} from "../dto/toChatDetailsDTO"
import { userMiddleware } from "../middlewares/userMiddleware"

export const chatApi = new Elysia({prefix: "/chat"})
  .use(userMiddleware)
  .get(
    "/:chatId",
    async ({userId, params}) => {
      const chat = await chatService.getChatDetailsForUser(
        userId,
        params.chatId
      )

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

      return toUserChatPreviewDTO(previewChats, userId)
    },
    {
      response: {200: t.Array(UserChatPreviewSchema), 401: t.Null()}
    }
  )
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
  .delete(
    "/delete",
    async ({body}) => {
      return await chatService.delete(body.chatId)
    },
    {
      body: t.Object({chatId: t.String()})
    }
  )
