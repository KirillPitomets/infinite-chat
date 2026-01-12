import Elysia, {t} from "elysia"
import {chatService} from "@/server/services/chat.services"
import {ChatPlain} from "@/prisma/generated/prismabox/Chat"
import {authMiddleware} from "@/server/middlewares/authMiddleware"
import {BadRequest} from "@/server/errors/domain.error"

export const chatApi = new Elysia({prefix: "/chat"})
  .use(authMiddleware)
  .get(
    "/all",
    async ({userId}) => {
      return await chatService.getAll(userId)
    },
    {
      response: {200: t.Array(ChatPlain), 401: t.Null()}
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
