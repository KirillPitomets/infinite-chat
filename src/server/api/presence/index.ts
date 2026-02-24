import { userContextMiddleware } from "@/server/middlewares/userContextMiddleware"
import Elysia from "elysia"
import { PresenceService } from "./presence.service"
import { realtime } from "@/shared/lib/realtime"
import { PresenceApiSchema } from "./types/PresenceApiSchema"

export const PresenceApi = new Elysia({ prefix: "/presence" })
  .use(userContextMiddleware)
  .post("/heartbeat", async ({ userId }) => {
    await PresenceService.heartbeat(userId)
    await realtime
      .channel(`user:${userId}`)
      .emit("user.presence", { userId, lastSeen: Date.now() })
  })
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
