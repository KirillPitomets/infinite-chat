# WebSocket API — /messages namespace

## Auth

Handshake: `Authorization: Bearer <clerk_jwt>` в headers.
При невалидном токене — `disconnect` + событие `exception`.

## Events (Client → Server)

### `room.join`

**Payload:** `JoinRoomDto`
| field | type | required |
|---|---|---|
| roomId | string (uuid) | yes |

**Emits back:** `room.joined` | `exception`

### `message.send`

**Payload:** `CreateMessageDto`
| field | type | required |
|---|---|---|
| roomId | string (uuid) | yes |
| text | string (2-160) | no* |
| replyToMessageId | string (uuid7) | no |
| attachments | CreateMessageAttachmentDto[] | no* |

\*text или attachments — минимум одно обязательно

**Broadcasts:** `message.created` to room

## Events (Server → Client)

### `message.created`

**Payload:** `MessageEntity` (см. ниже)

### `exception`

**Payload:** `{ status: 'error', error: string, timestamp: string }`
