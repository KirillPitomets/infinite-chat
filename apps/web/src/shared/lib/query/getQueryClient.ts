import {
  environmentManager,
  isServer,
  QueryCache,
  QueryClient
} from "@tanstack/react-query"
import { cache } from "react"
import { ApiError } from "../api/unwrap"
import toast from "react-hot-toast"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (count, error) => {
          if (error instanceof ApiError && error.status === 401) return false
          return count < 2
        },
        staleTime: 60 * 10
      }
    },
    queryCache: new QueryCache({
      onError: err => {
        if (err instanceof ApiError && err.status >= 500) {
          toast.error("Server error")
        }
      }
    })
  })
}

let browserQueryClient: QueryClient | undefined

export const getQueryClient = environmentManager.isServer()
  ? cache(makeQueryClient)
  : () => (browserQueryClient ??= makeQueryClient())
