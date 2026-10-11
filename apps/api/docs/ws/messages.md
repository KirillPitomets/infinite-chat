MessagesGateway — WebSocket API

Namespace: /messages
Transport: Socket.io
Auth: Clerk JWT через handshake.headers.authorization: Bearer <token>

Middleware stack
Слой Реализация Что делает
Guard WsAuthGuard Проверяет client.data.auth — БД не дёргает повторно
Filter WsExceptionFilter (@Catch(WsException, HttpException)) Ловит исключения, шлёт клиенту событие exception
Pipe WsExceptionPipe (transform: true, whitelist: true) Валидация DTO → WsException
Подключение (handleConnection)
Аутентифицирует через WsAuthService (Clerk JWT)
Кладёт { user } в client.data.auth
Подтягивает все комнаты пользователя через roomService.findUserRoomIds()
Автоматически джойнит клиент в roomId:${id} для каждой комнаты
typescript
client.join(roomIds.map((id) => `roomId:${id}`));
// Результат: сокет получит события, адресованные в эти socket.io rooms

Если что-то падает → exception эвент и разрыв соединения.

Отключение (handleDisconnect)

Логирует client.id. Дальнейшее обновление состояния (soft-delete RoomMember, очистка стейта) — TODO.

Формат ошибок

Все исключения приходят на событие exception:

typescript
{
status: 'error',
error: string | Record<string, any>, // текст ошибки или объект валидации
timestamp: string // ISO
}
Авторизация на уровне гейтвея

Перед каждой операцией проверяется Socket.io room-мемберство (не БД):

typescript
if (!client.rooms.has(`roomId:${roomId}`)) {
throw new WsException('User not a member of this room');
}

Дополнительно MessagesService дублирует проверку через roomService.assertUserInRoom() на уровне сервиса (защита на случай рассинхрона).

Client → Server events
Event Constant DTO Emit в ответ
message.send ClientMessageEvents.SEND CreateMessageDto message.created
message.update ClientMessageEvents.UPDATE UpdateMessageDto message.updated
message.delete ClientMessageEvents.DELETE DeleteMessageDto message.deleted
message.restore ClientMessageEvents.RESTORE RestoreMessageDto message.restored
message.send
typescript
class CreateMessageDto {
roomId: string;
text?: string | null; // 0–160 символов
replyToMessageId?: string | null; // UUID из того же roomId
attachments: CreateMessageAttachmentDto[] | null;
}

Правила:

Обязательно text или attachments
replyToMessageId должен быть из того же roomId
Проверка уникальности ключей в attachments

Response: message.created → сериализованный MessageEntity в roomId:${roomId}

message.update
typescript
class UpdateMessageDto extends CreateMessageDto {
messageId: string;
}

Правила:

text === undefined && attachments === undefined → error
Финальное сообщение не может быть пустым
Нельзя ответить на само себя
replyToMessageId: null явно снимает reply; undefined — не трогает

Response: message.updated → сериализованный MessageEntity в roomId:${roomId}

message.delete (soft-delete)
typescript
class DeleteMessageDto {
roomId: string;
messageId: string;
}

isDeleted: true, контент обнуляется перед отдачей клиенту.

Response: message.deleted → MessageEntity с text: null, attachments: []

message.restore
typescript
class RestoreMessageDto {
roomId: string;
messageId: string;
}

Восстановление soft-deleted сообщения.

Response: message.restored → полный MessageEntity

Server → Client events
Event Когда
message.created новое сообщение / system message
message.updated сообщение отредактировано
message.deleted soft-delete
message.restored восстановление
exception ошибка в connection/хендлерах

Все события доставляются через emitToRoom(roomId, event, payload):

typescript
private emitToRoom(
roomId: string,
event: MessageEvent,
message: MessageEntity,
) {
const payload = instanceToPlain(message) as MessagePayload;
this.server.to(`roomId:${roomId}`).emit(event, payload);
}
System Messages (через EventEmitter2)

Гейтвей слушает доменный эвент message:created от RoomEventListener:

typescript
@OnEvent('message:created')
async createSystemMessage(payload: SystemMessageCreatedEvent) {
const { message, roomId } = payload;
this.emitToRoom(roomId, 'message.created', message);
}

System messages (leave, kick, etc.) идут через ту же сетку message.created, различаются по message.type (USER | SYSTEM).

Payload: MessageEntity
typescript
{
id: string;
text: string | null;
sender: UserEntity;
replyToMessage?: ReplyMessageEntity | null;
attachments: MessageAttachmentEntity[];
isDeleted: boolean;
createdAt: Date;
updatedAt: Date;
// @Exclude(): senderId, roomId, replyToMessageId
}

ReplyMessageEntity — без вложенного replyToMessage (не рекурсивно).
