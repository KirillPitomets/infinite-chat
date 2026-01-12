import {createAuthServer} from "@neondatabase/auth/next/server"

import Elysia from "elysia"
import {userService} from "@/server/services/user.services"
import {UnauthorizedError} from "@/server/errors/domain.error"

export const authServer = createAuthServer()

export const authMiddleware = new Elysia({name: "auth"}).derive(
  {as: "scoped"},
  async () => {
    const seesion = await authServer.getSession()
    if (!seesion.data) {
      throw new UnauthorizedError()
    }

    const syncedUserWithDb = await userService.syncCurrentUser({
      id: seesion.data.user.id,
      email: seesion.data.user.email,
      name: seesion.data.user.name
    })

    if (!syncedUserWithDb) {
      throw new UnauthorizedError()
    }

    return {
      userId: syncedUserWithDb.id
    }
  }
)
