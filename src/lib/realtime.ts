import {Realtime, InferRealtimeEvents} from "@upstash/realtime"
import {redis} from "./redis"

import {z} from "zod"

const schema = {
  chat: {
    created: z.string(),
    deleted: z.string(),
    message: z.null()
  }
}

export const realtime = new Realtime({schema, redis})
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
