import { User } from "@/shared/types/api.type"
import { useQuery } from "@tanstack/react-query"
import { userKeys } from "../user.keys"

export function useCurrentUser(): User {
  const { data } = useQuery<User>({
    queryKey: userKeys.currentUser(),
    queryFn: () => {
      throw new Error("Should be hydrated, not refetched")
    },
    staleTime: 60_000
  })

  if (!data) {
    throw new Error(
      "useCurrentUserStrict called before currentUser was hydrated — check HydrationBoundary setup"
    )
  }

  return data
}
