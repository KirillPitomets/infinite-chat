import { userContextMiddleware } from "@/server/middlewares/userContextMiddleware"
import Elysia from "elysia"
import { PresenceService } from "./presence.service"
import { realtime } from "@/shared/lib/realtime"
import { PresenceApiSchema } from "./types/PresenceApiSchema"
import z from "zod"
import { userService } from "../user/user.services"

export const PresenceApi = new Elysia({ prefix: "/presence" })
  .use(userContextMiddleware)
  .post("/heartbeat", async ({ userId }) => {
    await PresenceService.heartbeat(userId)
    await realtime
      .channel(`user:${userId}`)
      .emit("user.presence", { userId, lastSeen: Date.now() })
  })
  .post(
    "/chats/:chatId/typing",
    async ({ userId, params, body }) => {
      const user = await userService.getById(userId)
      await realtime
        .channel(`presence:typing:chatId:${params.chatId}`)
        .emit("chat.presence.typing", {
          isTyping: body.isTyping,
          user: { id: user.id, name: user.name }
        })
    },
    { body: z.object({ isTyping: z.boolean() }) }
  )
  .get(
    "/:userId",
    async ({ params }) => {
      const { userId } = params
      const lastSeen = await PresenceService.getLastSeen(userId)

      return { lastSeen: lastSeen }
    },
    {
      response: PresenceApiSchema.presence.response
    }
  )
