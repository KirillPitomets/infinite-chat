import { IsUUID } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';
import { ApiProperty } from '@nestjs/swagger';

/*
undefined  = no field in dto = no change
null       = client made data is empty (remove text or replyMessage)
string     = change data from dto 
*/

export class UpdateMessageDto extends CreateMessageDto {
  @ApiProperty({
    description: 'Unique identifier of the message being updated (UUID v7)',
    example: '018f3b2c-8a1a-7b2c-8d3e-4f5a6b7c8d9e',
    format: 'uuid',
  })
  @IsUUID('7')
  messageId: string;
}
