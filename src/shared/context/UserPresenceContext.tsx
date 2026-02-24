import React, { useEffect } from "react"
import { edenClient } from "../lib/eden"

export const UserPresenceProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    const heartbeat = async () => {
      await edenClient.presence.heartbeat.post()
    }
    const interval = setInterval(heartbeat, 10000)
    return () => clearInterval(interval)
  }, [])

  return children
}
