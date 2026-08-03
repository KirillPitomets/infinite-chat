import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiDeleteRoom() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete room',
      description:
        'Permanently deletes a room and all its messages. For GROUP rooms, only the OWNER can delete; for DIRECT rooms, either member can delete.',
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiNoContentResponse({
      description: 'Room successfully deleted',
    }),
    ApiNotFoundResponse({
      description: 'Room not found, or user is not a member of this room',
    }),
    ApiForbiddenResponse({
      description: 'User is not the owner of this GROUP room',
    }),
  );
}
