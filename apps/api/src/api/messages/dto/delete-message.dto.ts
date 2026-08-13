import { IsUUID } from 'class-validator';

export class DeleteMessageDto {
  @IsUUID('4')
  roomId: string;

  @IsUUID('7')
  messageId: string;
}
