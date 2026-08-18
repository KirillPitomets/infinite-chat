import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagesService } from 'src/api/messages/messages.service';
import { TypedEventEmitterService } from 'src/common/events/typed-event-emitter.service';
import { RoomMemberKickedEvent, RoomMemberLeftEvent } from './events';

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
    const { actorId, kickedMemberId, roomId } = payload;
    const message = await this.messageService.createKickSystemMessage(
      actorId,
      kickedMemberId,
      roomId,
    );

    this.emitter.emit('message:created', { message, roomId });
  }
}
