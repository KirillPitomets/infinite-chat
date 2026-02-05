import {User} from "@/prisma/generated/client"
import {UserDTO} from "@/shared/user.schema"

export const toUserDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tag: user.tag,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt.toISOString(),
  }
}
