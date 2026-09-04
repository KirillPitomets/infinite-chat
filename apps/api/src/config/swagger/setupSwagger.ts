import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './swagger.config';
import { CreateMessageDto, UpdateMessageDto } from 'src/api/messages/dto';
import { DeleteMessageDto } from 'src/api/messages/dto/delete-message.dto';
import { RestoreMessageDto } from 'src/api/messages/dto/restore-message.dto';
import { CreateMessageAttachmentDto } from 'src/api/attachments/dto';
import { UpdateRoomMemberLastReadAtDto } from 'src/api/room/dto';

export const setupSwagger = (app: INestApplication) => {
  const config = getSwaggerConfig();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      CreateMessageDto,
      CreateMessageAttachmentDto,
      UpdateMessageDto,
      DeleteMessageDto,
      RestoreMessageDto,
      UpdateRoomMemberLastReadAtDto,
    ],
  });

  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs/json',
    yamlDocumentUrl: 'api/docs/yaml',
    customSiteTitle: 'Infinite Chat - API',
  });
};
