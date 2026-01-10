import {Elysia} from "elysia"
import {userApi} from "./user.api"
import {chatApi} from "./chat.api"

export const app = new Elysia({prefix: "/api"}).use(userApi).use(chatApi)
