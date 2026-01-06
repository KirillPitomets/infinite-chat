import {Elysia, t} from "elysia"

import {prisma} from "@/lib/prisma"
import {
  UserPlain,
  UserPlainInputCreate
} from "@/prisma/generated/prismabox/User"
import {authServer} from "@/lib/auth/server"

const user = new Elysia({prefix: "/user"}).get("/sync", async () => {
  const {data} = await authServer.getSession()

  return data
})

const app = new Elysia({prefix: "/api"}).use(user)

export const GET = app.fetch
export const POST = app.fetch

export type App = typeof app
