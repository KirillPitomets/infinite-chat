import {prisma} from "@/server/db/prisma"
import {authServer} from "@/lib/auth/server"

export const syncUser = async () => {
  try {
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

    const createdUser = await prisma.user.create({
      data: {
        authId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        tag: `@${data.user.email.split("@")[0]}`
      }
    })

    if (!createdUser) {
      return null
    }

    return createdUser
  } catch (error) {
    console.log("Error in SyncUser", error)
    throw new Error("Unauthorized")
  }
}
