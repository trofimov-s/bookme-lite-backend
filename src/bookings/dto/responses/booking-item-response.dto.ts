import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { BookingStatus } from '@/generated/prisma/enums';

@Exclude()
export class BookingItemResponseDto {
  @ApiProperty({
    description: 'Booking id',
    example: 'o4BK3P86xBab0hw1KTOG3',
    type: 'string',
  })
  @Expose()
  id: string;

  createdAt: Date;
  updatedAt: Date;

  @ApiProperty({
    description: 'Master id',
    example: 'o4BK3P86xBab0hw1KTOG3',
    type: 'string',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Booking end time',
    example: '2026-09-08T09:30:00.000Z',
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

  @ApiProperty({
    description: 'Booking status',
    example: BookingStatus.ACTIVE,
    enum: BookingStatus,
    enumName: 'BookingStatus',
  })
  @Expose()
  status: BookingStatus;

  @ApiProperty({
    description: 'Client name',
    example: 'John Doe',
    type: 'string',
  })
  @Expose()
  clientName: string;

  @ApiProperty({
    description: 'Client email',
    example: 'example@example.com',
    type: 'string',
  })
  @Expose()
  clientEmail: string | null;

  @ApiProperty({
    description: 'Client phone number',
    example: '+380981112233',
    type: 'string',
  })
  @Expose()
  clientPhone: string | null;
}
