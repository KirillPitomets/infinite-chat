import {
  CreateMessageDto,
  DeleteMessageDto,
  Message,
  RestoreMessageDto,
  UpdateMessageDto
} from "@/shared/types/api.type"

export interface ExceptionPayload {
  status: string
  error: unknown
  timestamp: string
}

export interface ServerToClientMessageEvents {
  "message.created": (message: Message) => void
  "message.updated": (message: Message) => void
  "message.deleted": (message: Message) => void
  "message.restored": (message: Message) => void

  exception: (payload: ExceptionPayload) => void
}

export interface ClientToServerMessageEvents {
  "message.send": (
    dto: CreateMessageDto,
    callback: (response: Message) => void
  ) => void
  "message.update": (dto: UpdateMessageDto) => Message
  "message.delete": (dto: DeleteMessageDto) => Message
  "message.restore": (dto: RestoreMessageDto) => Message
}

export const MessageEmits = {
  SEND: "message.send",
  UPDATE: "message.update",
  DELETE: "message.delete",
  RESTORE: "message.restore"
}

export type MessageListenEvents =
  | "message.created"
  | "message.updated"
  | "message.deleted"
  | "message.restored"
