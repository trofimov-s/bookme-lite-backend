import { Module } from '@nestjs/common';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

import { ScheduleModule } from '@/schedule';
import { UsersModule } from '@/users';

@Module({
  imports: [ScheduleModule, UsersModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
