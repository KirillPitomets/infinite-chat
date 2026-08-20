export class RoomMemberKickedEvent {
  actorId: string;
  kickedRoomMember: {
    id: string;
    userId: string;
  };
  roomId: string;

  constructor({
    actorId,
    kickedRoomMember,
    roomId,
  }: {
    actorId: string;
    kickedRoomMember: {
      id: string;
      userId: string;
    };
    roomId: string;
  }) {
    this.actorId = actorId;
    this.kickedRoomMember = kickedRoomMember;
    this.roomId = roomId;
  }
}
