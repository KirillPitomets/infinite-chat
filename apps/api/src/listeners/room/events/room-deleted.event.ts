export class RoomDeletedEvent {
  actorId: string;
  roomId: string;

  constructor(actorId: string, roomId: string) {
    this.roomId = roomId;
    this.actorId = actorId;
  }
}
