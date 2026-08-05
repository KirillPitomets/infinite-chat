import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class LimitPageQueryDto {
  @ApiPropertyOptional({
    description: 'Number of records to return',
    example: 100,
    minimum: 1,
    maximum: 1000,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit: number = 100;

  @ApiPropertyOptional({
    description: 'Number of page',
    example: 100,
    minimum: 1,
    maximum: 1000,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000)
  page: number = 0;
}
