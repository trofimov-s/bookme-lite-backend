import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ScheduleResponseDto {
  @Expose()
  id: string;

  userId: string;

  @Expose()
  startTime: number;

  @Expose()
  endTime: number;

  @Expose()
  weekday: number;
}
