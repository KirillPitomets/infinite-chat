import Elysia, {t} from "elysia"

import {UserPlain} from "@/prisma/generated/prismabox/User"
import {userService} from "@/server/services/user.services"
import {authMiddleware} from "@/server/middlewares/authMiddleware"

export const userApi = new Elysia({prefix: "/user"})
  .use(authMiddleware)
  .get(
    "/",
    async ({userId}) => {
      return await userService.getById(userId)
    },
    {response: {201: UserPlain}}
  )
  .get("/all", userService.getAllUsers, {
    response: {200: t.Array(UserPlain), 401: t.Null()}
  })
