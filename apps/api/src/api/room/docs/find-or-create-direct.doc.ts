import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RoomEntity } from '../entities';

export function ApiFindOrCreateDirectRoom() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find or create direct room',
      description:
        'Finds an existing 1-on-1 direct chat with a user or creates a new one.',
    }),
    ApiCreatedResponse({
      description: 'Direct room successfully retrieved or created',
      type: RoomEntity,
    }),
    ApiBadRequestResponse({
      description:
        'Attempted to create a chat with yourself or invalid user ID',
    }),
  );
}
