import {
  ClientToServerMessageEvents,
  ServerToClientMessageEvents
} from "@/shared/types/socket.events"
import { io, Socket } from "socket.io-client"

export type MessageSocket = Socket<
  ServerToClientMessageEvents,
  ClientToServerMessageEvents
>

const sockets: Record<string, MessageSocket> = {}

export function getSocket(
  namespace: string,
  getToken: () => Promise<string | null>
): MessageSocket {
  if (sockets[namespace]) return sockets[namespace]

  sockets[namespace] = io(`${process.env.NEXT_PUBLIC_WS_URL}/${namespace}`, {
    auth: cb => {
      getToken().then(token => cb({ token }))
    },
    autoConnect: false,
    transports: ["websocket"]
  })

  return sockets[namespace]
}

export function disconnectSocket(namespace: string) {
  sockets[namespace]?.disconnect()
  delete sockets[namespace]
}
