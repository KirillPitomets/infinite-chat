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
} from '@nestjs/swagger';
import { UpdateGroupNameDto } from '../dto/update-group-name.dto';
import { RoomEntity } from '../entities';

export function ApiUpdateGroupName() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update group room name',
      description:
        'Updates the name of a specific group room. Requires ADMIN or higher (Owner) role and that the user is a member of the group.',
    }),
    ApiParam({
      name: 'roomId',
      description: 'Unique room identifier (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      format: 'uuid',
    }),
    ApiBody({
      type: UpdateGroupNameDto,
      description: 'New name for the group room',
    }),
    ApiOkResponse({
      description: 'Group room name successfully updated',
      type: RoomEntity,
    }),
    ApiNotFoundResponse({
      description:
        'Group room with the specified ID was not found, type is not GROUP, or user is not a member',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data or validation failed',
    }),
  );
}
