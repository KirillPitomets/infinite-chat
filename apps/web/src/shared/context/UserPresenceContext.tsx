import React, { useEffect } from "react"

export const UserPresenceProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    const heartbeat = async () => {
      // await edenClient.presence.heartbeat.post()
    }
    const interval = setInterval(heartbeat, 10000)
    return () => clearInterval(interval)
  }, [])

  return children
}
