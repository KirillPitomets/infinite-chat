import {prisma} from "@/server/db/prisma"
import type {User} from "@/prisma/generated/client"
import {NotFoundError} from "@/server/errors/domain.error"

type SyncUserType = {
  id: string
  name: string
  email: string
}

class UserService {
  async syncCurrentUser(user: SyncUserType): Promise<User> {
    return prisma.user.upsert({
      where: {authId: user.id},
      update: {
        name: user.name,
        email: user.email
      },
      create: {
        authId: user.id,
        email: user.email,
        name: user.name,
        tag: `@${user.email.split("@")[0]}`
      }
    })
  }

  async getDbUserId(authId: string): Promise<string> {
    const userId = await prisma.user.findUnique({
      where: {authId}
    })

    if (!userId) {
      throw new NotFoundError("User DataBase Id")
    }

    return userId.id
  }

  async getById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {id}
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

  async getAllUsers() {
    return prisma.user.findMany()
  }
}

export const userService = new UserService()
