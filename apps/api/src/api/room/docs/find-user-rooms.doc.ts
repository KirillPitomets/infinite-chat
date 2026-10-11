import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RoomEntity } from '../entities';

export function ApiFindUserRooms() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all rooms for current user',
      description:
        'Retrieves a list of all rooms (direct and group) that the current user belongs to.',
    }),
    ApiOkResponse({
      description: 'List of rooms successfully retrieved',
      type: RoomEntity,
      isArray: true,
    }),
  );
}
