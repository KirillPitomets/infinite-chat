import Elysia from "elysia"
import {api} from "./api"
import {DomainError, errorStatusMap} from "./errors/domain.error"

export const app = new Elysia({name: "app"})
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
  .use(api)
