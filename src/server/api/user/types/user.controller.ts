import { UserSchema } from "@/shared/schemes/user.schema"
import z from "zod"

export const UserApiSchema = {
  current: {
    response: UserSchema
  },
  getAll: {
    response: z.union([z.array(UserSchema), z.null()])
  }
} as const
