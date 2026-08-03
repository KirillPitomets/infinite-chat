import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiLeaveRoom() {
  return applyDecorators(
    ApiOperation({
      summary: 'Leave a room',
      description:
        'Allows the current user to leave a specific room by removing their membership Group owners cannot leave their groups directly.',
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiNoContentResponse({
      description: 'Successfully left the room',
    }),
    ApiNotFoundResponse({
      description: 'Room not found or user is not in this room',
    }),
    ApiBadRequestResponse({
      description:
        'User is the group owner and cannot leave without transferring ownership first, or the room is a DIRECT chat (leaving is not supported for direct messages)',
    }),
  );
}
