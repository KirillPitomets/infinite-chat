import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Infinite Chat - API')
    .setDescription('Core API documentation for infinite chat')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
};
