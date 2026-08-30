"use client"

import {
  disconnectSocket,
  getSocket,
  MessageSocket
} from "@/shared/lib/socket/socketFactory"
import { useAuth } from "@clerk/nextjs"
import { createContext, useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"

type SocketMap = {
  rooms: Socket | null
  messages: MessageSocket | null
  notifications: Socket | null
}

const SocketContext = createContext<SocketMap>({
  messages: null,
  notifications: null,
  rooms: null
})
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth()
  const [sockets, setSockets] = useState<SocketMap>({
    rooms: null,
    messages: null,
    notifications: null
  })

  useEffect(() => {
    if (!isSignedIn) return

    const messages = getSocket("messages", getToken)
    const rooms = getSocket("rooms", getToken)

    rooms.connect()
    messages.connect()

    setSockets({ rooms, messages, notifications: null })

    return () => {
      disconnectSocket("rooms")
      disconnectSocket("messages")
      setSockets({ rooms: null, messages: null, notifications: null })
    }
  }, [isSignedIn])

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  )
}

export const useMessagesSocket = () => useContext(SocketContext).messages
export const useRoomsSocket = () => useContext(SocketContext).rooms
