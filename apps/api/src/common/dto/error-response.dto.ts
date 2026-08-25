import { ApiProperty } from '@nestjs/swagger';

export class ErrResponse {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'User not found',
  })
  message: string | string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
