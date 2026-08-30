import { ApiProperty } from '@nestjs/swagger';
import { MessageAttachmentType } from 'src/generated/prisma/enums';

export class CreateMessageAttachmentDto {
  @ApiProperty({
    description: 'Name of the attachment file',
    example: 'document.pdf',
  })
  name: string;

  @ApiProperty({
    description: 'Storage key or unique path identifier for the file',
    example: 'uploads/attachments/document_uuid.pdf',
  })
  key: string;

  @ApiProperty({
    description: 'Type of the message attachment',
    enum: MessageAttachmentType,
    example: MessageAttachmentType.IMAGE,
  })
  type: MessageAttachmentType;

  @ApiProperty({
    description: 'File size in bytes (maximum 20MB / 20971520 bytes)',
    example: 1048576,
    maximum: 20 * 1024 * 1024,
  })
  size: number;

  @ApiProperty({
    description: 'Public URL of the attachment file',
    example: 'https://storage.example.com/uploads/document.pdf',
  })
  url: string;
}
