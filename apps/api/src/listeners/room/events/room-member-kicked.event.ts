export class RoomMemberKickedEvent {
  actorId: string;
  kickedMemberId: string;
  roomId: string;

  constructor(actorId: string, kickedMemberId: string, roomId: string) {
    this.actorId = actorId;
    this.kickedMemberId = kickedMemberId;
    this.roomId = roomId;
  }
}
