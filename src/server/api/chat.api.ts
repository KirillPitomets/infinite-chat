import Elysia, {t} from "elysia"
import {chatService} from "../services/chat.services"
import {ChatPlain} from "@/prisma/generated/prismabox/Chat"

export const chatApi = new Elysia({prefix: "/chat"}).get(
  "/all",
  chatService.getAll,
  {response: {200: t.Array(ChatPlain), 401: t.Null()}}
)
