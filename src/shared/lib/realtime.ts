import {Realtime, InferRealtimeEvents} from "@upstash/realtime"
import {redis} from "./redis"
import {z} from "zod"
import {ChatMessageSchema} from "@/shared/schemes/message.schema"

const schema = {
  chat: {
    // [userID, userID]
    created: z.object({
      memberships: z.array(z.object({userId: z.string()}))
    }),
    deleted: z.object({
      memberships: z.array(z.object({userId: z.string()}))
    }),
    message: {
      created: ChatMessageSchema,
      updated: ChatMessageSchema, // id, content
      deleted: ChatMessageSchema // id
    }
  }
}

export const realtime = new Realtime({schema, redis})
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
