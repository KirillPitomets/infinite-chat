import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './swagger.config';
import { cleanupOpenApiDoc } from 'nestjs-zod';

export const setupSwagger = (app: INestApplication) => {
  // patchNestJsSwagger();
  const config = getSwaggerConfig();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document), {
    jsonDocumentUrl: 'api/docs/json',
    yamlDocumentUrl: 'api/docs/yaml',
    customSiteTitle: 'Infinite Chat - API',
  });
};
