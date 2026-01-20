import {auth} from "@clerk/nextjs/server"
import {UnauthorizedError} from "../errors/domain.error"

export const authMiddleware = async () => {
  const {userId, isAuthenticated} = await auth()

  if (!isAuthenticated || !userId) {
    throw new UnauthorizedError()
  }

  return {clerkId: userId}
}
