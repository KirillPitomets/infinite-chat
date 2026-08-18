export class RoomMemberLeftEvent {
  actorId: string;
  roomId: string;

  constructor(actorId: string, roomId: string) {
    this.actorId = actorId;
    this.roomId = roomId;
  }
}
