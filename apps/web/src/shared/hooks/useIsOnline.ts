import { useQuery } from "@tanstack/react-query"
import { presenceKeys } from "../lib/query/presence.keys"

export const useIsOnline = (userId: string) => {
  const { data: lastSeen } = useQuery({
    queryKey: presenceKeys.presence(userId),
    queryFn: () => null,
    staleTime: Infinity,
    initialData: null
  })

  if (!lastSeen) return false

  return Date.now() - lastSeen < 15_000
}
