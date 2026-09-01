import { components, paths, operations } from "@/shared/lib/api/schema"

export type User = components["schemas"]["UserEntity"]
export type ChatRoom = components["schemas"]["RoomEntity"]
export type Message = components["schemas"]["MessageEntity"]
export type MessageAttachments =
  components["schemas"]["MessageAttachmentEntity"]

export type UserListResponse =
  paths["/api/v1/user"]["get"]["responses"]["200"]["content"]["application/json"]

export type CreateMessageDto = components["schemas"]["CreateMessageDto"]
export type CreateMessageAttachmentDto =
  components["schemas"]["CreateMessageAttachmentDto"]
export type DeleteMessageDto = components["schemas"]["DeleteMessageDto"]
export type UpdateMessageDto = components["schemas"]["UpdateMessageDto"]
export type RestoreMessageDto = components["schemas"]["RestoreMessageDto"]

export type CloudinaryPresignSlot = components["schemas"]["PresignedUrlEntity"]
