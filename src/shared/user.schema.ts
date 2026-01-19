import {Static, t} from "elysia"

export const UserSchema = t.Object({
  id: t.String(),
  tag: t.String(),
  email: t.String(),
  name: t.String(),
  createdAt: t.String({format: "date-time"}),
})

export type UserDTO = Static<typeof UserSchema>
