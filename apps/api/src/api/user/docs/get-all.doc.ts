import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserEntity } from '../entity';

export function ApiGetAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all users',
      description:
        'Retrieves a list of users from the database with an optional limit constraint.',
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Maximum number of users to fetch',
      example: 100,
    }),
    ApiOkResponse({
      description: 'List of users successfully retrieved',
      type: UserEntity,
      isArray: true,
    }),
  );
}
