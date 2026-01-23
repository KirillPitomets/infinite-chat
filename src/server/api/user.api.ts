import Elysia, {t} from "elysia"

import {userService} from "@/server/services/user.services"
import {UserDTO, UserSchema} from "@/shared/user.schema"
import {toUserDTO} from "../dto/toUserDTO"
import {userContextMiddleware} from "../middlewares/userContextMiddleware"

export const userApi = new Elysia({prefix: "/user"})
  .use(userContextMiddleware)
  .get(
    "/",
    async ({userId}) => {
      const user = await userService.getById(userId)
      return toUserDTO(user)
    },
    {response: {201: UserSchema}}
  )
  .get(
    "/all",
    async () => {
      const users = await userService.getAllUsers()

      const usersDTO: UserDTO[] = users.map(u => toUserDTO(u))

      return usersDTO
    },
    {
      response: {200: t.Array(UserSchema), 401: t.Null()}
    }
  )
