"use client"
import { usePresenceSocket } from "@/features/chat/providers/socketProvider"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { presenceKeys } from "../lib/query/presence.keys"

export const PresenceListener = () => {
  const socket = usePresenceSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    const handleOnline = (userId: string) => {
      queryClient.setQueryData(presenceKeys.presence(userId), Date.now())
    }
    const handleOffline = (userId: string) => {
      queryClient.setQueryData(presenceKeys.presence(userId), null)
    }

    socket.on("presence.online", handleOnline)
    socket.on("presence.offline", handleOffline)

    return () => {
      socket.off("presence.online", handleOnline)
      socket.off("presence.offline", handleOffline)
    }
  }, [socket, queryClient])

  return null
}
