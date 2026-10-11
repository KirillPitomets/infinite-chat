import { RoomMemberEntity } from 'src/api/room/entities/room-member.entity';

export class RoomMemberJoined {
  roomMember: RoomMemberEntity;
  roomId: string;

  constructor(member: RoomMemberEntity, roomId: string) {
    this.roomMember = member;
    this.roomId = roomId;
  }
}
