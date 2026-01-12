import {Elysia} from "elysia"
import {userApi} from "./user.api"
import {chatApi} from "./chat.api"
import {DomainError, errorStatusMap} from "@/server/errors/domain.error"

export const app = new Elysia({prefix: "/api"})
  .onError(({error, set}) => {
    console.log(error)
    if (typeof error === "object" && error && "code" in error) {
      const domainError = error as DomainError
      set.status = errorStatusMap[domainError.code]
      return {error: domainError.message}
    }

    // unexpected error
    set.status = 500
    return {error: "Internal server error"}
  })
  .use(userApi)
  .use(chatApi)
