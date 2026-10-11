"use client"
import { usePresenceSocket } from "@/features/chat/providers/socketProvider"
import React, { useEffect } from "react"

export const HeartbeatPresence = () => {
  const presenceSocket = usePresenceSocket()

  useEffect(() => {
    if (!presenceSocket) return
    const heartbeat = () => {
      presenceSocket.emit("presence.heartbeat")
    }
    heartbeat()
    const interval = setInterval(heartbeat, 7_000)
    return () => clearInterval(interval)
  }, [presenceSocket])

  return null
}
