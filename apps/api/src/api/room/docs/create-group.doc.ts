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
    ApiOperation({
      summary: 'Create group room',
      description:
        'Creates a new group room with the current user as OWNER and the specified members added to the group.',
    }),
    ApiCreatedResponse({
      description: 'Group room successfully created',
      type: RoomEntity,
    }),
    ApiBadRequestResponse({
      description:
        'The creator ID is included in memberIds, or one or more provided member IDs do not exist',
    }),
  );
}
