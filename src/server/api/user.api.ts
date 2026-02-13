import Elysia from "elysia"

import {userService} from "@/server/services/user.services"
import {UserDTO, UserSchema} from "@/shared/user.schema"
import z from "zod"
import {toUserDTO} from "../dto/toUserDTO"
import {userContextMiddleware} from "../middlewares/userContextMiddleware"
import {realtime} from "@/lib/realtime"
import {redis} from "@/lib/redis"

export const userApi = new Elysia({prefix: "/user"})
  .use(userContextMiddleware)
  .get(
    "/current",
    async ({userId}) => {
      const user = await userService.getById(userId)
      return toUserDTO(user)
    },
    {response: UserSchema}
  )
  .get(
    "/all",
    async () => {
      const users = await userService.getAllUsers()

      const usersDTO: UserDTO[] = users.map(u => toUserDTO(u))

      return usersDTO
    },
    {
      response: z.union([z.array(UserSchema), z.null()])
    }
  )
  .post(
    "/presence",
    async ({userId}) => {
      // TODO: last seen
    },
    {}
  )
