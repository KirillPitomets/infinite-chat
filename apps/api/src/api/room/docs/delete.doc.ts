import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function ApiDeleteRoom() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete room',
      description: 'Deletes a room by its ID.',
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
      description: 'Room not found',
    }),
  );
}
