"use client"

import {
  ChatRoomSocket,
  disconnectSocket,
  getSocket,
  MessageSocket,
  PresenceSocket
} from "@/shared/lib/socket/socketFactory"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"

type SocketMap = {
  rooms: ChatRoomSocket | null
  messages: MessageSocket | null
  presence: PresenceSocket | null
  notifications: Socket | null
}

const SocketContext = createContext<SocketMap>({
  messages: null,
  notifications: null,
  presence: null,
  rooms: null
})
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth()
  const [sockets, setSockets] = useState<SocketMap>({
    rooms: null,
    messages: null,
    presence: null,
    notifications: null
  })

  useEffect(() => {
    if (!isSignedIn) return

    const messages = getSocket("messages", getToken)
    const rooms = getSocket("rooms", getToken)
    const presence = getSocket("presence", getToken)

    rooms.connect()
    messages.connect()
    presence.connect()

    setSockets({ rooms, presence, messages, notifications: null })

    return () => {
      disconnectSocket("rooms")
      disconnectSocket("messages")
      disconnectSocket("presence")

      setSockets({
        rooms: null,
        presence: null,
        messages: null,
        notifications: null
      })
    }
  }, [isSignedIn])

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  )
}

export const useMessagesSocket = () => useContext(SocketContext).messages
export const useChatRoomSocket = () => useContext(SocketContext).rooms
export const usePresenceSocket = () => useContext(SocketContext).presence
