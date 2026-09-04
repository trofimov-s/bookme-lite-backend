import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { ScheduleDayRequestDto } from './schedule-day-request.dto';

import { IsWeekdaysUnique } from '@/schedule/validators';

export class ScheduleBatchRequestDto {
  @ApiProperty({ description: 'An array of weekdays', type: [ScheduleDayRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsWeekdaysUnique()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDayRequestDto)
  items: ScheduleDayRequestDto[];
}
