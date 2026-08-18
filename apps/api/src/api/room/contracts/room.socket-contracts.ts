import { RoomEntity } from '../entities';
import { RoomMemberEntity } from '../entities/room-member.entity';

type RoomMemberPayload = Omit<RoomMemberEntity, 'roomId' | 'userId' | 'leftAt'>;

export type RoomPayload = Omit<RoomEntity, 'memberships'> & {
  memberships: RoomMemberPayload[];
};

export interface ServerToClientRoomEvents {
  'room.created': (room: RoomPayload) => void;
  'room.deleted': ({ roomId }: { roomId: string }) => void;
  'room.member-left': ({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string;
  }) => void;
  'room.member-kicked': ({
    actorId,
    kickedMemberId,
    roomId,
  }: {
    actorId: string;
    kickedMemberId: string;
    roomId: string;
  }) => void;
}
