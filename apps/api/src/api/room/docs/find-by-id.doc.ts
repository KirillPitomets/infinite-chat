import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { RoomEntity } from '../entities';
import { ErrResponse } from 'src/common/dto/error-response.dto';

export function ApiFindRoomById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find room by ID for current user',
      description:
        'Fetches details of a specific room if the user is a participant.',
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Room details successfully retrieved',
      type: RoomEntity,
    }),
    ApiNotFoundResponse({
      description:
        'Room with the specified ID was not found or user is not a member',
      type: ErrResponse,
    }),
  );
}
