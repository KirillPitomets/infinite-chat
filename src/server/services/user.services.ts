import {prisma} from "@/server/db/prisma"
import {authServer} from "@/lib/auth/server"
import type {User} from "@/prisma/generated/client"

class UserService {
  async syncCurrentUser(): Promise<User | null> {
    const {data} = await authServer.getSession()

    if (!data) {
      return null
    }

    const existUser = await prisma.user.findUnique({
      where: {authId: data.user.id}
    })

    if (existUser) {
      return existUser
    }

    const dbUser = await prisma.user.create({
      data: {
        authId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        tag: `@${data.user.email.split("@")[0]}`
      }
    })

    return dbUser
  }

  async getDbUserId(): Promise<string | null> {
    const {data} = await authServer.getSession()
    if (!data) {
      return null
    }

    const userId = await prisma.user.findUnique({
      where: {authId: `${data.user.id}`}
    })

    if (!userId) {
      throw new Error("User not found")
    }

    return userId.id
  }

  async getById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {id}
    })
    if (!user) return null
    return user
  }

  async getByTag(tag: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        tag
      }
    })
    if (!user) return null
    return user
  }
}

export const userService = new UserService()
