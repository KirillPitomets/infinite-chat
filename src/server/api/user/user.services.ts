import { prisma } from "@/server/db/prisma"
import type { User } from "@/prisma/generated/client"
import { NotFoundError } from "@/server/errors/domain.error"
import { redis } from "@/shared/lib/redis"

type SyncUserType = Pick<User, "authId" | "email" | "imageUrl" | "name">

class UserService {
  async syncCurrentUser(user: SyncUserType): Promise<User> {
    return prisma.user.upsert({
      where: { authId: user.authId },
      update: {
        name: user.name,
        email: user.email
      },
      create: {
        authId: user.authId,
        email: user.email,
        name: user.name,
        tag: `@${user.email.split("@")[0]}`,
        imageUrl: user.imageUrl
      }
    })
  }

  async getDbUserByAuthId(authId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { authId }
    })

    if (!user) {
      throw new NotFoundError("User in data base by Auth ID")
    }

    return user
  }

  async getById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new NotFoundError("User by id")
    }

    return user
  }

  async getByTag(tag: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        tag
      }
    })
    if (!user) {
      throw new NotFoundError("User by tag")
    }
    return user
  }

  async heartbeart(userId: string) {
    await redis.set(`presence:user:${userId}`, Date.now(), { ex: 15 })
  }

  async getAllUsers() {
    return prisma.user.findMany()
  }

  async getLastSeen(userId: string) {
    const lastSeen = await redis.get<number>(`presence:user:${userId}`)
    if (!lastSeen) {
      return 0
    }

    return lastSeen
  }
}

export const userService = new UserService()
