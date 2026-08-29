import { User } from "@/shared/types/api.type"
import { useQuery } from "@tanstack/react-query"

export function useCurrentUser(): User {
  const { data } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: () => {
      throw new Error("Should be hydrated, not refetched")
    }
  })

  if (!data) {
    throw new Error(
      "useCurrentUserStrict called before currentUser was hydrated — check HydrationBoundary setup"
    )
  }

  return data
}
