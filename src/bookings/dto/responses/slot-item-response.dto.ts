import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SlotItemResponseDto {
  @Expose()
  startTime: number;

  @Expose()
  endTime: number;

  @Expose()
  isLocked: boolean;
}
