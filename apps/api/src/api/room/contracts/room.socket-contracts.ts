import { UpdateRoomMemberLastReadAtDto } from '../dto';
import { RoomEntity } from '../entities';
import { RoomMemberEntity } from '../entities/room-member.entity';

export type RoomMemberPayload = Omit<
  RoomMemberEntity,
  'roomId' | 'userId' | 'leftAt'
>;

export type RoomPayload = Omit<RoomEntity, 'memberships'> & {
  memberships: RoomMemberPayload[];
};

export interface ServerToClientRoomEvents {
  'room.created': (room: RoomPayload) => void;
  'room.deleted': () => void;
  'room.member-left': (userId: string) => void;
  'room.member-kicked': ({
    actorId,
    kickedMemberId,
  }: {
    actorId: string;
    kickedMemberId: string;
  }) => void;
  'room.member-joined': (roomMember: RoomMemberPayload) => void;
  'room.updated-member-read-at': (roomMember: RoomMemberPayload) => void;
}

export interface ClientToServerRoomEvents {
  'room.update-member-read-at': (dto: UpdateRoomMemberLastReadAtDto) => void;
}

export const ClientRoomEvents = {
  updateReadAt: 'room.update-member-read-at',
} satisfies Record<string, keyof ClientToServerRoomEvents>;

export type ServerRoomEvents = keyof ServerToClientRoomEvents;
