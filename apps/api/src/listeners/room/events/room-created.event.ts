import { RoomEntity } from 'src/api/room/entities';

export class RoomCreatedEvent {
  actorId: string;
  entity: RoomEntity;

  constructor(actorId: string, entity: RoomEntity) {
    this.actorId = actorId;
    this.entity = entity;
  }
}
