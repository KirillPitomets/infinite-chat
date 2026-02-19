import Elysia from "elysia"
import {api} from "./api"
import {DomainError, errorStatusMap} from "./errors/domain.error"
import {ZodError} from "zod"

export const app = new Elysia({name: "app"})
  .onError(({error, set}) => {
    console.log(error)
    if (error instanceof ZodError) {
      return {message: error.message, issues: error.issues}
    }

    if (typeof error === "object" && error && "code" in error) {
      const domainError = error as DomainError
      set.status = errorStatusMap[domainError.code]
      return {message: domainError.message}
    }

    // unexpected error
    set.status = 500
    return {message: "Internal server error"}
  })
  .use(api)
