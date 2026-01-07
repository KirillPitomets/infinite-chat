import Elysia, {t} from "elysia"
import {UserPlain} from "@/prisma/generated/prismabox/User"
import {syncUser} from "../services/user.services"

export const userApi = new Elysia({prefix: "/user"}).get("/sync", syncUser, {
  response: {200: UserPlain, 401: t.Null()}
})

// "use server"
