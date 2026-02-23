import React, { useEffect } from "react"
import { edenClient } from "../lib/eden"

export const UserPresenceProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    const heartbeart = async () => {
      await edenClient.user.heartbeart.post()
    }
    const interval = setInterval(heartbeart, 10000)
    return () => clearInterval(interval)
  }, [])

  return children
}
