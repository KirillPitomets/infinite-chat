import type { User } from "@/prisma/generated/client"
import { prisma } from "@/server/db/prisma"
import { NotFoundError } from "@/server/errors/domain.error"

type SyncUserType = Pick<User, "authId" | "email" | "imageUrl" | "name">

class UserService {
  private generateTag(name: string): string {
    const base = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
    const discriminator = Math.floor(1000 + Math.random() * 9000).toString()
    return `${base}#${discriminator}`
  }

  async syncUser(user: SyncUserType): Promise<User> {
    const updatedUser = prisma.user.upsert({
      where: { authId: user.authId },
      update: {
        name: user.name,
        email: user.email
      },
      create: {
        authId: user.authId,
        email: user.email.toLowerCase(),
        name: user.name,
        tag: this.generateTag(user.name),
        imageUrl: user.imageUrl
      }
    })

    return updatedUser
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

  async getAllUsers() {
    return prisma.user.findMany()
  }
}

export const userService = new UserService()
