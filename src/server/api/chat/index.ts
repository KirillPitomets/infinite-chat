import { userContextMiddleware } from "@/server/middlewares/userContextMiddleware"
import { realtime } from "@/shared/lib/realtime"
import Elysia from "elysia"
import { chatService } from "./chat.service"
import { toChatDetailsDTO } from "./dto/toChatDetailsDTO"
import { toChatDTO } from "./dto/toChatDTO"
import { toUserChatPreviewDTO } from "./dto/toUserChatPreviewDTO"
import { ChatApiSchema } from "./types/chat.controller"

export const chatApi = new Elysia({ prefix: "/chat" })
  .use(userContextMiddleware)
  .post(
    "/create",
    async ({ userId, body }) => {
      const chat = await chatService.createDirectChat(userId, body.memberTag)

      await realtime
        .channel("chats")
        .emit("chat.created", { memberships: chat.memberships })

      return toChatDTO(chat)
    },
    {
      body: ChatApiSchema.create.body,
      response: ChatApiSchema.create.response
    }
  )
  .get(
    "/:chatId",
    async ({ userId, params }) => {
      const chat = await chatService.getChatDetailsForUser(
        userId,
        params.chatId
      )
      return toChatDetailsDTO(chat, userId)
    },
    {
      response: ChatApiSchema.get.response
    }
  )
  .get(
    "/preview",
    async ({ userId }) => {
      const previewChats = await chatService.getUserChatsPreview(userId)
      return toUserChatPreviewDTO(previewChats, userId)
    },
    {
      response: ChatApiSchema.preview.response
    }
  )
  .delete(
    "/",
    async ({ body }) => {
      const deletedChat = await chatService.delete(body.chatId)
      await realtime
        .channel("chats")
        .emit("chat.deleted", { memberships: deletedChat.memberships })
      return deletedChat
    },
    {
      body: ChatApiSchema.delete.body
    }
  )
