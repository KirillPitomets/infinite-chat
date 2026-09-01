import { IsEnum, IsInt, IsString, IsUrl, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageAttachmentType } from 'src/generated/prisma/enums';

export class CreateMessageAttachmentDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the attachment file',
    example: 'document',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Storage key or unique path identifier for the file',
    example: 'uploads/attachments/document_uuid.pdf',
  })
  key: string;

  @IsEnum(MessageAttachmentType)
  @ApiProperty({
    description: 'Type of the message attachment',
    enum: MessageAttachmentType,
    example: MessageAttachmentType.IMAGE,
  })
  type: MessageAttachmentType;

  @IsInt()
  @Max(20 * 1024 * 1024)
  @ApiProperty({
    description: 'File size in bytes (maximum 20MB / 20971520 bytes)',
    example: 1048576,
    maximum: 20 * 1024 * 1024,
  })
  size: number;

  @IsUrl()
  @ApiProperty({
    description: 'Public URL of the attachment file',
    example: 'https://storage.example.com/uploads/document.pdf',
  })
  url: string;
}
