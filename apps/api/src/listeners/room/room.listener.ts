import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagesService } from 'src/api/messages/messages.service';
import { TypedEventEmitterService } from 'src/common/events/typed-event-emitter.service';
import { RoomMemberKickedEvent, RoomMemberLeftEvent } from './events';
import { RoomMemberJoined } from './events/room-member-joined.event';

@Injectable()
export class RoomEventListener {
  constructor(
    private readonly messageService: MessagesService,
    private readonly emitter: TypedEventEmitterService,
  ) {}

  @OnEvent('room:member-left')
  async handleSystemMessageAboutLeft(payload: RoomMemberLeftEvent) {
    const { actorId, roomId } = payload;
    const message = await this.messageService.createLeftSystemMessage(
      actorId,
      roomId,
    );

    this.emitter.emit('message:created', { message, roomId });
  }

  @OnEvent('room:member-kicked')
  async handleSystemMessageAboutMemberKicked(payload: RoomMemberKickedEvent) {
    const { actorId, kickedRoomMember, roomId } = payload;
    const message = await this.messageService.createKickSystemMessage(
      actorId,
      kickedRoomMember.id,
      roomId,
    );

    this.emitter.emit('message:created', { message, roomId });
  }

  @OnEvent('room:member-joined')
  async handleSystemMessageAboutMemberJoined(payload: RoomMemberJoined) {
    const { roomMember, roomId } = payload;

    const message = await this.messageService.createJoinSystemMessage(
      roomMember.userId,
      roomId,
    );

    this.emitter.emit('message:created', { message, roomId });
  }
}
