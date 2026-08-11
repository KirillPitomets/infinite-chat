import { IsInt, Max, Min } from 'class-validator';

export class CountPresignQueryDto {
  @IsInt()
  @Min(1)
  @Max(6)
  count: number;
}
