import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PresignedUrlEntity } from 'src/infra/cloudinary/entity/PresignedUrl.entity';

export function ApiPresignAttachments() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Generate presigned attachment upload URLs',
      description:
        'Generates Cloudinary presigned upload URLs for uploading message attachments directly from the client.',
    }),
    ApiParam({
      name: 'roomId',
      type: String,
      description: 'Unique room identifier (uuid)',
      example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    }),
    ApiCreatedResponse({
      description: 'Presigned upload URLs generated successfully',
      type: PresignedUrlEntity,
    }),
    ApiUnauthorizedResponse({
      description: 'User is not authenticated (missing or invalid Clerk token)',
    }),
    ApiNotFoundResponse({
      description: 'User profile with the specified Clerk ID was not found',
    }),
  );
}
