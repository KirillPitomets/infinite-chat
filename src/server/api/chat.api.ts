import Elysia, {t} from "elysia"
import {chatService} from "@/server/services/chat.services"
import {authMiddleware} from "@/server/middlewares/authMiddleware"
import {BadRequest} from "@/server/errors/domain.error"
import {UserChatPreviewSchema} from "../types/chat.types"

export const chatApi = new Elysia({prefix: "/chat"})
  .use(authMiddleware)
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
      if (!body.memberTag) {
        throw new BadRequest("Expected - member tag")
      }
      return await chatService.create(userId, body)
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
      if (!body.chatId) {
        throw new BadRequest("Expected - chat Id")
      }
      return await chatService.delete(body.chatId)
    },
    {
      body: t.Object({chatId: t.String()})
    }
  )
