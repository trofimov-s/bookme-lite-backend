import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import type { CreateBookingRequestDto, SlotResponseDto } from './dto';
import { SLOTS_CALCULATION_UTILS } from './utils';

import { AppException } from '@/core';
import { Booking, BookingStatus, Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma';
import { ScheduleService } from '@/schedule';
import { DATE_UTILS, ErrorCode } from '@/shared';
import { UsersService } from '@/users';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async getUserSlots(slug: string, date: string, viewerTimeZone: string): Promise<SlotResponseDto> {
    const user = await this.usersService.findBySlug(slug);

    if (!user) {
      throw new NotFoundException(`User with slug: "${slug}" not found`);
    }

    const viewerDayBounds = DATE_UTILS.getDayBoundsInTimeZone(date, viewerTimeZone);

    const masterDates = DATE_UTILS.getCalendarDatesInTimeZoneRange(
      viewerDayBounds.startAt,
      viewerDayBounds.endAt,
      user.timeZone,
    );

    const masterDays = masterDates.map((masterDate) => ({
      date: masterDate,
      ...DATE_UTILS.getDayBoundsInTimeZone(masterDate, user.timeZone),
    }));

    const masterRangeStartAt = masterDays[0].startAt;
    const masterRangeEndAt = masterDays[masterDays.length - 1].endAt;

    const bookings = await this.prismaService.booking.findMany({
      where: {
        userId: user.id,
        status: BookingStatus.ACTIVE,
        startTime: { lt: masterRangeEndAt },
        endTime: { gt: masterRangeStartAt },
      },
    });

    const slotGroups = await Promise.all(
      masterDays.map(async ({ date: masterDate, weekday }) => {
        const schedule = await this.scheduleService.getUserScheduleByWeekday(user.id, weekday);

        if (!schedule) {
          return [];
        }

        return SLOTS_CALCULATION_UTILS.calculateSlots({
          bookings,
          duration: user.slotDurationMinutes,
          scheduleStartTime: schedule.startTime,
          scheduleEndTime: schedule.endTime,
          date: masterDate,
          timeZone: user.timeZone,
        });
      }),
    );

    const slots = slotGroups
      .flat()
      .filter((slot) => slot.startAt >= viewerDayBounds.startAt && slot.startAt < viewerDayBounds.endAt)
      .sort((firstSlot, secondSlot) => firstSlot.startAt.getTime() - secondSlot.startAt.getTime());

    return {
      date,
      slots,
      masterTimeZone: user.timeZone,
    };
  }

  async createBooking(dto: CreateBookingRequestDto) {
    const user = await this.usersService.findBySlug(dto.slug);

    if (!user) {
      throw new NotFoundException(`User with slug: "${dto.slug}" not found`);
    }

    const startAt = new Date(dto.startAt);

    if (Number.isNaN(startAt.getTime())) {
      throw new BadRequestException('Invalid booking start time');
    }

    if (startAt.getUTCSeconds() !== 0 || startAt.getUTCMilliseconds() !== 0) {
      throw new BadRequestException('Booking must start at an exact minute');
    }

    if (startAt < new Date()) {
      throw new BadRequestException('Time cannot be in the past');
    }

    const { date: localDate, minutes: startMinutes } = DATE_UTILS.getDateAndMinutesInTimeZone(startAt, user.timeZone);

    const { weekday } = DATE_UTILS.getDayBoundsInTimeZone(localDate, user.timeZone);
    const daySchedule = await this.scheduleService.getUserScheduleByWeekday(user.id, weekday);

    if (!daySchedule) {
      throw new NotFoundException(`Cannot find schedule for this date: "${localDate}"`);
    }

    const duration = user.slotDurationMinutes;
    const endMinutes = startMinutes + duration;

    if (daySchedule.startTime > startMinutes || daySchedule.endTime < endMinutes) {
      throw new BadRequestException('Invalid time');
    }

    if ((startMinutes - daySchedule.startTime) % duration !== 0) {
      throw new BadRequestException('Incorrect slot start time');
    }

    const endAt = new Date(startAt.getTime() + duration * 60 * 1000);

    const existingBooking = await this.prismaService.booking.findFirst({
      where: {
        userId: user.id,
        startTime: startAt,
        status: BookingStatus.ACTIVE,
      },
    });

    if (existingBooking) {
      throw new AppException(
        ErrorCode.BOOKING_SLOT_UNAVAILABLE,
        HttpStatus.CONFLICT,
        'This slot is no longer available',
      );
    }

    try {
      return await this.prismaService.booking.create({
        data: {
          userId: user.id,
          clientName: dto.clientName,
          clientEmail: dto.clientEmail,
          clientPhone: dto.clientPhone,
          startTime: startAt,
          endTime: endAt,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppException(
          ErrorCode.BOOKING_SLOT_UNAVAILABLE,
          HttpStatus.CONFLICT,
          'This slot is no longer available',
        );
      }

      throw error;
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.prismaService.booking.findMany({ where: { userId }, orderBy: { startTime: 'asc' } });
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { userId, id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.prismaService.booking.update({
      where: { id: bookingId, userId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  }
}
