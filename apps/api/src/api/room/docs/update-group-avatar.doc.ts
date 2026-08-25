import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateGroupAvatarDto } from '../dto';
import { RoomEntity } from '../entities';
import { ErrResponse } from 'src/common/dto/error-response.dto';

export function ApiUpdateGroupAvatar() {
  return applyDecorators(
    ApiTags('Room Group - Update Avatar'),
    ApiOperation({
      summary: 'Update group room avatar image',
      description: `
Step 3 of 3 in the direct upload flow (presigned Cloudinary upload).

Saves the avatar reference (secure URL + public ID) after the client has already uploaded the file directly to Cloudinary using the presigned signature from step 1. This endpoint does **not** receive the file itself — only the resulting metadata.

📖 **Full frontend integration guide**: [avatar-upload-integration.md](https://github.com/KirillPitomets/infinite-chat/tree/migrate-elysia-to-nest/apps/api/docs/guides/avatar-upload-integration.md)

⚠️ Requires ADMIN or higher role. \`avatarUrl\` is validated against the Cloudinary domain to prevent arbitrary URL injection.
      `,
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiBody({
      type: UpdateGroupAvatarDto,
      description:
        'Avatar URL and public ID returned by Cloudinary after upload (step 2)',
    }),
    ApiOkResponse({
      description: 'Group room avatar successfully updated',
      type: RoomEntity,
    }),
    ApiNotFoundResponse({
      description:
        'Group room with the specified ID was not found or user is not a member',
      type: ErrResponse,
    }),
    ApiBadRequestResponse({
      description:
        'Invalid input data, validation failed, avatarUrl does not match the expected Cloudinary domain',
      type: ErrResponse,
    }),
  );
}
