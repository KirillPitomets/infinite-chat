import {Elysia} from "elysia"
import {userApi} from "./user.api"

export const app = new Elysia({prefix: "/api"}).use(userApi)
