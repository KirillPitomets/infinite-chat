import {Elysia, t} from "elysia"
import {userApi} from "./user.api"
import {chatApi} from "./chat.api"
import {messagesApi} from "./messages.api"

export const api = new Elysia({name: "api", prefix: "/api"})

  .use(userApi)
  .use(chatApi)
  .use(messagesApi)
