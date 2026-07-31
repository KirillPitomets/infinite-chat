import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class LimitQueryDto {
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
}
