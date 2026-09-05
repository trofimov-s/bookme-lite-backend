import { Exclude, Expose } from 'class-transformer';

import { SlotItemResponseDto } from './slot-item-response.dto';

@Exclude()
export class SlotResponseDto {
  @Expose()
  date: string;

  @Expose()
  slots: SlotItemResponseDto[];
}
