import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ScheduleResponseDto {
  userId: string;

  @Expose()
  @ApiProperty({ description: 'id', example: 'fPT7R2iwCQh9aAyYW7421' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Time when master starts work', example: 540 })
  startTime: number;

  @Expose()
  @ApiProperty({ description: 'Time when master ends work', example: 1040 })
  endTime: number;

  @Expose()
  @ApiProperty({ description: 'Index of the day in a week context. 0 = Sunday', example: 1 })
  weekday: number;
}
