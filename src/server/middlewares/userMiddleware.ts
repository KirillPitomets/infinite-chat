import Elysia from "elysia"
import {clerkClient} from "@clerk/nextjs/server"
import {InternalServerError, UnauthorizedError} from "../errors/domain.error"
import {userService} from "../services/user.services"
import {authMiddleware} from "./authMiddleware"

export const userMiddleware = new Elysia({name: "sync-user"})
  .derive({as: "scoped"}, authMiddleware)
  .derive({as: "scoped"}, async ({clerkId}) => {
    if (!clerkId) {
      console.log(clerkId)
      throw new InternalServerError("userMIddleware required clerkId")
    }

    const client = await clerkClient()
    const clerkUser = await client.users.getUser(clerkId)

    if (!clerkUser) {
      throw new UnauthorizedError()
    }
    /*
      Note: To make sure "username" and "primaryEmailAddress" are set as Required in your Clerk Dashboard: 
      see: https://dashboard.clerk.com/apps
    */
    if (!clerkUser.username || !clerkUser.primaryEmailAddress?.emailAddress) {
      throw new InternalServerError(
        "Clerk user misconfigured: username or email missed"
      )
    }

    const user = await userService.syncCurrentUser({
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
