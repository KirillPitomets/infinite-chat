import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Infinite Chat - API')
    .setDescription('Core API documentation for infinite chat')
    .setExternalDoc(
      '📁 Integration guides for multi-step flows',
      'https://github.com/KirillPitomets/infinite-chat/tree/migrate-elysia-to-nest/apps/api/docs/guides',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
};
