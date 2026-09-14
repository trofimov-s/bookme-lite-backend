import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { SlotItemResponseDto } from './slot-item-response.dto';

@Exclude()
export class SlotResponseDto {
  @ApiProperty({
    description: 'Selected date',
    example: '2026-09-08',
    type: 'string',
    format: 'date',
  })
  @Expose()
  date: string;

  @ApiProperty({
    description: 'An array of slots',
    type: [SlotItemResponseDto],
  })
  @Expose()
  slots: SlotItemResponseDto[];
}
