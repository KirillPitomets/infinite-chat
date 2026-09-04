import {
  ChatRoom,
  ChatRoomMember,
  UpdateRoomMemberLastReadAtDto
} from "../api.type"
import { ExceptionEvents } from "./exception.events"

export interface ServerToClientRoomEvents extends ExceptionEvents {
  "room.created": (room: ChatRoom) => void
  "room.deleted": () => void
  "room.member-left": (userId: string) => void
  "room.member-kicked": ({
    actorId,
    kickedMemberId
  }: {
    actorId: string
    kickedMemberId: string
  }) => void
  "room.member-joined": (roomMember: ChatRoomMember) => void
  "room.updated-member-read-at": (roomMember: ChatRoomMember) => void
}

export interface ClientToServerRoomEvents {
  "room.update-member-read-at": (dto: UpdateRoomMemberLastReadAtDto) => void
}

export const ClientRoomEvents = {
  updateReadAt: "room.update-member-read-at"
} satisfies Record<string, keyof ClientToServerRoomEvents>

export type ServerRoomEvents = keyof ServerToClientRoomEvents
