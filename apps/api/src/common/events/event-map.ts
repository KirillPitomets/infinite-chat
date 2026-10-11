import { SystemMessageCreatedEvent } from 'src/api/messages/events/SystemMessageCreated.event';
import {
  RoomCreatedEvent,
  RoomDeletedEvent,
  RoomMemberKickedEvent,
  RoomMemberLeftEvent,
} from 'src/listeners/room/events';
import { RoomMemberJoined } from 'src/listeners/room/events/room-member-joined.event';

interface NotificationEventMap {
  'room:created': RoomCreatedEvent & { recipientIds: string[] };
  'room:deleted': RoomDeletedEvent & { recipientIds: string[] };
}

interface RoomEventMap {
  'room:member-kicked': RoomMemberKickedEvent;
  'room:member-left': RoomMemberLeftEvent;
  'room:member-joined': RoomMemberJoined;
}

interface SystemMessageEventMap {
  'message:created': SystemMessageCreatedEvent;
}

export interface AppEventMap
  extends RoomEventMap, SystemMessageEventMap, NotificationEventMap {}

export type AppEventName = keyof AppEventMap;
