import {chatService} from "@/server/services/chat.services"
import {ChatDetailsSchema} from "@/shared/chat.schema"
import Elysia from "elysia"
import z from "zod"
import {UserChatPreviewSchema} from "../../shared/chatPreview.schema"
import {toChatDetailsDTO} from "../dto/toChatDetailsDTO"
import {toUserChatPreviewDTO} from "../dto/toUserChatPreviewDTO"
import {userContextMiddleware} from "../middlewares/userContextMiddleware"

export const chatApi = new Elysia({prefix: "/chat"})
  .use(userContextMiddleware)
  .post(
    "/create",
    async ({userId, body}) => {
      return await chatService.createDirectChat(userId, body)
    },
    {
      body: z.object({memberTag: z.string()})
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
      params: z.object({chatId: z.string()}),
      response: z.union([ChatDetailsSchema, z.null()])
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
      response: z.array(UserChatPreviewSchema)
    }
  )
  .delete(
    "/",
    async ({body}) => {
      return await chatService.delete(body.chatId)
    },
    {
      body: z.object({chatId: z.string()})
    }
  )
