import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export function ApiGetById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user by ID',
      description:
        'Fetches a single user record from the database by its unique identifier.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique user identifier (uuid)',
      example: '070145d6-2ba3-4588-b911-7e168e6d4880',
    }),
    ApiOkResponse({
      description: 'User successfully retrieved',
      type: UserEntity,
    }),
    ApiNotFoundResponse({
      description: 'User with the specified ID was not found',
    }),
  );
}
