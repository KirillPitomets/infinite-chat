import Elysia from "elysia"
import { userService } from "@/server/api/user/user.services"
import { InternalServerError, UnauthorizedError } from "../errors/domain.error"
import { auth, clerkClient } from "@clerk/nextjs/server"

export const userContextMiddleware = new Elysia({ name: "user-context" })
  // .use(authMiddleware)
  .derive({ as: "scoped" }, async () => {
    const { userId: clerkId, isAuthenticated } = await auth()
    if (!isAuthenticated || !clerkId) {
      throw new UnauthorizedError()
    }

    const client = await clerkClient()
    const clerkUser = await client.users.getUser(clerkId)

    /*
      Note: To make sure "username" and "primaryEmailAddress" are set as Required in your Clerk Dashboard: 
      see: https://dashboard.clerk.com/apps
    */
    if (!clerkUser.username || !clerkUser.primaryEmailAddress?.emailAddress) {
      throw new InternalServerError("Clerk misconfigured")
    }

    const user = await userService.syncUser({
      authId: clerkUser.id,
      email: clerkUser.primaryEmailAddress.emailAddress,
      imageUrl: clerkUser.imageUrl,
      name: clerkUser.username
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    return {
      userId: user.id
    }
  })
