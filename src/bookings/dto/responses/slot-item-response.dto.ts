import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SlotItemResponseDto {
  @ApiProperty({
    example: '2026-09-16T05:00:00.000Z',
    description: 'UTC instant at which the slot starts',
    format: 'date-time',
  })
  @Expose()
  startAt: Date;

  @ApiProperty({
    example: '2026-09-16T05:00:00.000Z',
    description: 'UTC instant at which the slot ends',
    format: 'date-time',
  })
  @Expose()
  endAt: Date;

  @ApiProperty({
    example: true,
    description: 'Is slot available',
  })
  @Expose()
  isLocked: boolean;
}
