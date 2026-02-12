import {Realtime, InferRealtimeEvents} from "@upstash/realtime"
import {redis} from "./redis"
import {z} from "zod"
import { ChatMessageSchema } from "@/shared/message.schema"


const schema = {
  chat: {
    created: z.string(),
    deleted: z.string(),
    message: ChatMessageSchema
  }
}

export const realtime = new Realtime({schema, redis})
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
