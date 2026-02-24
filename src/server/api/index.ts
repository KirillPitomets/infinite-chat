import { Elysia } from "elysia"
import { chatApi } from "@/server/api/chat"
import { messagesApi } from "@/server/api/message"
import { userApi } from "@/server/api/user"
import { PresenceApi } from "./presence"

export const api = new Elysia({ name: "api", prefix: "/api" })
  .use(userApi)
  .use(PresenceApi)
  .use(chatApi)
  .use(messagesApi)
