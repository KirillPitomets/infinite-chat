import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrResponse } from 'src/common/dto/error-response.dto';
import { PresignedUrlEntity } from 'src/infra/cloudinary/entity/PresignedUrl.entity';

export function ApiPresignGroupAvatar() {
  return applyDecorators(
    ApiTags('Room Group - Update Avatar'),
    ApiOperation({
      summary: 'Generate presigned signature for group avatar upload',
      description: `
Step 1 of 3 in the direct upload flow (presigned Cloudinary upload).

📖 **Full frontend integration guide**: [avatar-upload-integration.md](https://github.com/KirillPitomets/infinite-chat/tree/migrate-elysia-to-nest/apps/api/docs/guides/avatar-upload-integration.md)

⚠️ Step 2 (file upload) goes directly to Cloudinary, not through our backend.
  `,
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Presigned upload credentials successfully generated',
      type: PresignedUrlEntity,
    }),
    ApiNotFoundResponse({
      description:
        'Group room with the specified ID was not found or user is not a member',
      type: ErrResponse,
    }),
  );
}
