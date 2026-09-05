import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { BookingStatus } from '@/generated/prisma/enums';

@Exclude()
export class CreateBookingResponseDto {
  @ApiProperty({
    description: 'Booking ID',
    example: 'asdfko32t2kl45tgasf',
    type: 'string',
  })
  @Expose()
  id: string;

  createdAt: Date;
  updatedAt: Date;
  userId: string;

  @ApiProperty({
    description: 'Booking start time',
    example: '2026-09-08T09:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @Expose()
  startTime: Date;

  @ApiProperty({
    description: 'Booking end time',
    example: '2026-09-08T09:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @Expose()
  endTime: Date;

  status: BookingStatus;

  @ApiProperty({
    description: 'Booking client name',
    example: 'John Doe',
    type: 'string',
  })
  @Expose()
  clientName: string;

  clientEmail: string | null;
  clientPhone: string | null;
}
