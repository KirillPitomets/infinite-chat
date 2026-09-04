import {
  CreateMessageDto,
  DeleteMessageDto,
  Message,
  RestoreMessageDto,
  UpdateMessageDto
} from "@/shared/types/api.type"
import { ExceptionEvents } from "./exception.events"

export interface ServerToClientMessageEvents extends ExceptionEvents {
  "message.created": (message: Message) => void
  "message.updated": (message: Message) => void
  "message.deleted": (message: Message) => void
  "message.restored": (message: Message) => void
}

export interface ClientToServerMessageEvents {
  "message.send": (
    dto: CreateMessageDto,
    callback: (response: Message) => void
  ) => void
  "message.update": (
    dto: UpdateMessageDto,
    callback: (response: Message) => void
  ) => void
  "message.delete": (
    dto: DeleteMessageDto,
    callback: (response: Message) => void
  ) => void
  "message.restore": (
    dto: RestoreMessageDto,
    callback: (response: Message) => void
  ) => void
}

export const MessageEmits = {
  SEND: "message.send",
  UPDATE: "message.update",
  DELETE: "message.delete",
  RESTORE: "message.restore"
} satisfies Record<string, keyof ClientToServerMessageEvents>

export type MessageListenEvents = keyof ServerToClientMessageEvents
