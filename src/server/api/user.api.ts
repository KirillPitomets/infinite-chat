import Elysia, {t} from "elysia"

import {userService} from "@/server/services/user.services"
import {authMiddleware} from "@/server/middlewares/authMiddleware"
import {UserDTO, UserSchema} from "@/shared/user.schema"
import {toUserDTO} from "../dto/toUserDTO"

export const userApi = new Elysia({prefix: "/user"})
  .use(authMiddleware)
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
