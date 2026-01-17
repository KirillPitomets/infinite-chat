import Elysia, {t} from "elysia"
import {chatService} from "@/server/services/chat.services"
import {authMiddleware} from "@/server/middlewares/authMiddleware"
import {UserChatPreviewSchema} from "../../shared/chatPreview.schema"
import {ChatDetailsSchema} from "@/shared/chat.schema"

export const chatApi = new Elysia({prefix: "/chat"})
  .use(authMiddleware)
  .get(
    "/:chatId",
    async ({userId, params}) => {
      return await chatService.getChatDetailsForUser(userId, params.chatId)
    },
    {
      params: t.Object({chatId: t.String()}),
      response: {200: ChatDetailsSchema, 401: t.Null()}
    }
  )
  .get(
    "/preview",
    async ({userId}) => {
      return await chatService.getUserChatsPreview(userId)
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
