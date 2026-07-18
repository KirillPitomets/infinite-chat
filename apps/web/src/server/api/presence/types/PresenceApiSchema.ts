import z from "zod"

export const PresenceApiSchema = {
  presence: { response: z.object({ lastSeen: z.number() }) }
} as const
