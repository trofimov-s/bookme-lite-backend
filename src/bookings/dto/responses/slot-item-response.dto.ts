import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SlotItemResponseDto {
  @ApiProperty({
    example: 540,
    description: 'Slot start time',
    type: 'integer',
  })
  @Expose()
  startTime: number;

  @ApiProperty({
    example: 570,
    description: 'Slot end time',
    type: 'integer',
  })
  @Expose()
  endTime: number;

  @ApiProperty({
    example: true,
    description: 'Is slot available',
    type: 'boolean',
  })
  @Expose()
  isLocked: boolean;
}
