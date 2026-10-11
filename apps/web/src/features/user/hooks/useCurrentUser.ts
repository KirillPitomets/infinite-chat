import { User } from "@/shared/types/api.type"
import { useQuery } from "@tanstack/react-query"
import { userKeys } from "../user.keys"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"

export function useCurrentUser(): User {
  const api = useApiClient()

  const { data } = useQuery<User>({
    queryKey: userKeys.currentUser(),
    queryFn: async () => {
      return await unwrap(api.GET("/api/v1/user/me"))
    },
    staleTime: 60_000
  })

  if (!data) {
    throw new Error(
      "useCurrentUser called before currentUser was hydrated — check HydrationBoundary setup"
    )
  }

  return data
}
