# MessagesGateway — WebSocket API

**Namespace:** `/messages`
**Transport:** Socket.io
**Auth:** Clerk JWT, передаётся в `handshake.headers.authorization: Bearer <token>`

## Middleware stack

Применяется на уровне класса гейтвея (глобальные HTTP-пайпы/фильтры на WS не действуют):

| Слой   | Реализация                                                 | Что делает                                                                           |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Guard  | `WsAuthGuard`                                              | Читает `client.data.auth`, заполненный в `handleConnection` — БД не дёргает повторно |
| Filter | `WsExceptionFilter` (`@Catch(WsException, HttpException)`) | Ловит исключения из хендлеров, шлёт клиенту событие `exception`                      |
| Pipe   | `ValidationPipe` (`transform: true, whitelist: true`)      | Валидация DTO, ошибки флаттенятся в `WsException`                                    |

---

## Подключение (`handleConnection`)

1. Достаёт `Bearer` токен из `handshake.headers.authorization`
2. Верифицирует через Clerk (`verifyToken`)
3. Ищет пользователя в БД (`userService.findByClerkId`) — 404 → `WsException('User not found')`
4. Кладёт `{ user }` в `client.data.auth`
5. Подтягивает все комнаты пользователя (`roomService.findUserRoomIds`) и **автоматически джойнит их все** через `client.join(roomIds)`

Если любой шаг падает — клиенту летит `exception` (см. формат ниже) и сокет разрывается (`client.disconnect()`).

> ⚠️ Комнаты присоединяются **только на connect**, явных `room.join` / `room.leave` хендлеров в гейтвее нет — см. блок "Известные несостыковки".

## Отключение (`handleDisconnect`)

Логирует `client.id` в консоль. Не снимает `RoomMember`, не чистит стейт — TODO при необходимости.

---

## Формат ошибок

Все исключения (`WsException` и `HttpException`) перехватываются `WsExceptionFilter` и приходят клиенту одним и тем же событием:

```typescript
client.on('exception', (payload: {
  status: 'error';
  error: string | Record<string, any>;
  timestamp: string; // ISO
}) => { ... });
```

`error` — это либо строка (из `WsException.getError()` или `HttpException.message`), либо объект (если `WsException` был создан с объектом). У `ValidationPipe` ошибки валидации всегда приходят строкой через `.join(', ')`.

---

## Client → Server events

| Event             | Constant                      | DTO                 | Условие                 | Emits в ответ             |
| ----------------- | ----------------------------- | ------------------- | ----------------------- | ------------------------- |
| `message.send`    | `ClientMessageEvents.SEND`    | `CreateMessageDto`  | юзер состоит в `roomId` | `message.created` → room  |
| `message.update`  | `ClientMessageEvents.UPDATE`  | `UpdateMessageDto`  | юзер состоит в `roomId` | `message.updated` → room  |
| `message.delete`  | `ClientMessageEvents.DELETE`  | `DeleteMessageDto`  | юзер состоит в `roomId` | `message.deleted` → room  |
| `message.restore` | `ClientMessageEvents.RESTORE` | `RestoreMessageDto` | юзер состоит в `roomId` | `message.restored` → room |

Проверка членства в комнате на уровне гейтвея — **не через БД**, а через `client.rooms.has(roomId)` (Socket.io room-мемберство, синхронизированное на connect). Дополнительно `MessagesService` дублирует проверку через `roomService.assertUserInRoom()` — защита на случай рассинхрона `client.rooms` с реальным состоянием в БД (см. "service-layer auth checks" в принципах проекта).

### `message.send`

```typescript
class CreateMessageDto {
  roomId: string; // UUID v4
  text?: string | null; // 0–160 символов
  replyToMessageId?: string | null; // UUID v7
  attachments: CreateMessageAttachmentDto[] | null;
}
```

Правила:

- Обязательно `text` **или** `attachments` — иначе `400 Message must have text or attachments`
- `replyToMessageId` должен ссылаться на сообщение из того же `roomId`, иначе `409 Cannot reply to message from another room`
- При наличии `attachments` — проверка уникальности `key` (`attachmentsService.ensureAttachmentKeysAreUnique`)

**Emit:** `message.created` — сериализованный `MessageEntity` (через `instanceToPlain`) всей комнате `roomId`.

### `message.update`

```typescript
class UpdateMessageDto extends CreateMessageDto {
  messageId: string; // UUID v7
}
```

Правила:

- `text === undefined && attachments === undefined` → `400`
- Итоговое сообщение не может остаться без контента — проверяется комбинация текущего состояния сообщения и патча (`ensureMessageWillHaveContent`)
- Нельзя ответить на само себя (`replyToMessageId === messageId`) → `400 Message cannot reply on itself`
- `replyToMessageId: null` явно снимает reply; `undefined` — не трогает

**Emit:** `message.updated` — та же схема, что и `message.created`.

### `message.delete`

```typescript
class DeleteMessageDto {
  roomId: string; // UUID v4
  messageId: string; // UUID v7
}
```

Soft-delete: `isDeleted: true`, `text`/`attachments` обнуляются перед отдачей клиенту (контент не должен светиться после удаления). Повторное удаление → `400 Message already deleted`.

**Emit:** `message.deleted` — `MessageEntity` с `text: null, attachments: []`.

### `message.restore`

```typescript
class RestoreMessageDto {
  roomId: string; // UUID v4
  messageId: string; // UUID v7
}
```

Восстановление soft-deleted сообщения. Если сообщение не было удалено → `400 Message already restoredd` _(опечатка в коде, см. ниже)_.

**Emit:** `message.restored` — полный `MessageEntity`.

---

## Server → Client events

| Event              | Payload                                    | Когда                               |
| ------------------ | ------------------------------------------ | ----------------------------------- |
| `message.created`  | `MessageEntity`                            | новое сообщение в комнате           |
| `message.updated`  | `MessageEntity`                            | сообщение отредактировано           |
| `message.deleted`  | `MessageEntity` (text/attachments очищены) | soft-delete                         |
| `message.restored` | `MessageEntity`                            | восстановление после soft-delete    |
| `exception`        | `{ status: 'error', error, timestamp }`    | любая ошибка в connection/хендлерах |

### `MessageEntity`

```typescript
{
  id: string;
  text: string | null;
  sender: UserEntity;
  replyToMessage?: ReplyMessageEntity | null;
  attachments: MessageAttachmentEntity[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  // senderId, roomId, replyToMessageId — @Exclude(), в payload не попадают
}
```

`ReplyMessageEntity` — то же самое, но без вложенного `replyToMessage` (не рекурсивно).
