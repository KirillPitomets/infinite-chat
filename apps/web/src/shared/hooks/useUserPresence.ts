import { useRealtime } from "../lib/realtime-client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { edenClient } from "../lib/eden"
import { useEffect, useState } from "react"

type UserPresence = { lastSeen: number | null }

export function usePresenceUserStatus(userId: string) {
  const queryClient = useQueryClient()
  const [now, SetNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      SetNow(Date.now())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const { data } = useQuery<UserPresence>({
    queryKey: ["presence", "user", userId],
    queryFn: async () => {
      const res = await edenClient.presence({ userId }).get()
      if (res.status !== 200 || !res.data) {
        return { lastSeen: null }
      }

      return res.data
    },
    staleTime: 10_000
  })

  useRealtime({
    channels: [`user:${userId}`],
    events: ["user.presence"],
    onData: ({ data, event }) => {
      if (event === "user.presence") {
        queryClient.setQueryData<UserPresence>(
          ["presence", "user", userId],
          () => ({ lastSeen: data.lastSeen })
        )
      }
    }
  })

  const isOnline = !!data?.lastSeen && now - data.lastSeen < 15_000
  return { isOnline }
}
