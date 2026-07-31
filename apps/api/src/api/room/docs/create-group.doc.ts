import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RoomEntity } from '../entities';

export function ApiCreateGroupRoom() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create group room',
      description: 'Creates a new group room with multiple members.',
    }),
    ApiCreatedResponse({
      description: 'Group room successfully created',
      type: RoomEntity,
    }),
    ApiBadRequestResponse({
      description: 'Some provided member IDs do not exist',
    }),
  );
}
