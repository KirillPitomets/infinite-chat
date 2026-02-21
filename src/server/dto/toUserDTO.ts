import { User } from "@/prisma/generated/client"
import { User as UserDto } from "@/shared/schemes/user.schema"

export const toUserDTO = (user: User): UserDto => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tag: user.tag,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt.toISOString()
  }
}
