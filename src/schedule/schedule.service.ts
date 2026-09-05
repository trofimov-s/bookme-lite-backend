import { Injectable } from '@nestjs/common';

import { ScheduleDayRequestDto } from './dto';

import { AvailabilitySlot } from '@/generated/prisma/client';
import { AvailabilitySlotCreateManyInput } from '@/generated/prisma/models';
import { PrismaService } from '@/prisma';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  getUserSchedule(userId: string): Promise<AvailabilitySlot[]> {
    return this.prismaService.availabilitySlot.findMany({ where: { userId } });
  }

  async replaceSchedule(userId: string, days: ScheduleDayRequestDto[]) {
    const updatedDays = await this.prismaService.$transaction(async (tx) => {
      await tx.availabilitySlot.deleteMany({ where: { userId } });

      const data = days.map((day): AvailabilitySlotCreateManyInput => ({
        startTime: day.startTime,
        endTime: day.endTime,
        weekday: day.weekday,
        userId,
      }));

      await tx.availabilitySlot.createMany({ data });

      return tx.availabilitySlot.findMany({ where: { userId } });
    });

    return updatedDays;
  }

  async getUserScheduleByWeekday(userId: string, weekday: number): Promise<AvailabilitySlot | null> {
    return await this.prismaService.availabilitySlot.findUnique({
      where: {
        userId_weekday: {
          userId,
          weekday,
        },
      },
    });
  }
}
