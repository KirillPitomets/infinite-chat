import { IsUUID } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

/*
undefined  = no field in dto = no change
null       = client made data is empty (remove text or replyMessage)
string     = change data from dto 
*/

export class UpdateMessageDto extends CreateMessageDto {
  @IsUUID('7')
  messageId: string;
}
