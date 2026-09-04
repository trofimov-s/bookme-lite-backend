import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

import { IsBeforeEndTime } from '@/shared';

export class ScheduleDayRequestDto {
  @ApiProperty({ example: 540, description: 'The start time of a work day' })
  @IsInt()
  @Min(0)
  @Max(1440)
  @IsBeforeEndTime()
  startTime: number;

  @ApiProperty({ example: 1040, description: 'The end time of a work day' })
  @IsInt()
  @Min(0)
  @Max(1440)
  endTime: number;

  @ApiProperty({ example: 1, description: 'The index of the day in a week. Start from Monday' })
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;
}
