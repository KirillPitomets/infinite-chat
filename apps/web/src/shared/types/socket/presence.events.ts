import { ExceptionEvents } from "./exception.events"

export interface ServerToClientPresenceEvents extends ExceptionEvents {
  "presence.typing": ({
    chatRoomId,
    userId
  }: {
    chatRoomId: string
    userId: string
  }) => void
  "presence.online": (userId: string) => void
  "presence.offline": (userId: string) => void
}

export interface ClientToServerPresenceEvents {
  "presence.typing": (dto: { roomId: string }) => void
  "presence.heartbeat": () => void
}

export const PresenceEmits = {
  TYPING: "presence.typing",
  HEARTBEAT: "presence.heartbeat"
} satisfies Record<string, keyof ClientToServerPresenceEvents>

export type PresenceEventMap = {
  [K in keyof ServerToClientPresenceEvents]: Parameters<
    ServerToClientPresenceEvents[K]
  >[0]
}
