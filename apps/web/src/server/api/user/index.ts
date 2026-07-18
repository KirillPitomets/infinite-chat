import { userService } from "@/server/api/user/user.services"
import { toUserDTO } from "@/server/dto/toUserDTO"
import { userContextMiddleware } from "@/server/middlewares/userContextMiddleware"
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
