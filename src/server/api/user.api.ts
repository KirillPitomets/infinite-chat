import Elysia, {t} from "elysia"
import {UserPlain} from "@/prisma/generated/prismabox/User"
import {userService} from "../services/user.services"

export const userApi = new Elysia({prefix: "/user"}).get(
  "/sync",
  userService.syncCurrentUser,
  {
    response: {200: UserPlain, 401: t.Null()}
  }
)
