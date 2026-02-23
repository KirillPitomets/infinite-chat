import { userService } from "@/server/api/user/user.services"
import { toUserDTO } from "@/server/dto/toUserDTO"
import { userContextMiddleware } from "@/server/middlewares/userContextMiddleware"
import { realtime } from "@/shared/lib/realtime"
import { User } from "@/shared/schemes/user.schema"
import Elysia from "elysia"
import { UserApiSchema } from "./types/user.controller"

export const userApi = new Elysia({ prefix: "/user" })
  .use(userContextMiddleware)
  .get(
    "/current",
    async ({ userId }) => {
      const user = await userService.getById(userId)
      return toUserDTO(user)
    },
    { response: UserApiSchema.current.response }
  )
  .post("/heartbeart", async ({ userId }) => {
    await userService.heartbeart(userId)
    await realtime
      .channel(`user:${userId}`)
      .emit("user.presence", { userId, lastSeen: Date.now() })
  })
  .get(
    "/presence/:userId",
    async ({ params }) => {
      const { userId } = params
      const lastSeen = await userService.getLastSeen(userId)

      return { lastSeen: lastSeen }
    },
    {
      response: UserApiSchema.presence.response
    }
  )
  .get(
    "/all",
    async () => {
      const users = await userService.getAllUsers()

      const usersDTO: User[] = users.map(u => toUserDTO(u))

      return usersDTO
    },
    {
      response: UserApiSchema.getAll.response
    }
  )
