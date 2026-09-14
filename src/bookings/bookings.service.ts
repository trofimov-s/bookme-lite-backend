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

  async getUserSlots(slug: string, date: string): Promise<SlotResponseDto> {
    const user = await this.usersService.findBySlug(slug);

    if (!user) {
      throw new NotFoundException(`User with slug: "${slug}" not found`);
    }

    const { weekday, startOfDay, endOfDay } = DATE_UTILS.getUtcDayBounds(date);
    const day = await this.scheduleService.getUserScheduleByWeekday(user.id, weekday);

    if (!day) {
      return { date, slots: [] };
    }

    const bookings = await this.prismaService.booking.findMany({
      where: {
        userId: user.id,
        startTime: { gte: startOfDay, lte: endOfDay },
      },
    });

    const duration = user.slotDurationMinutes;

    const slots = SLOTS_CALCULATION_UTILS.calculateSlots(bookings, duration, day.startTime, day.endTime);

    return {
      date,
      slots,
    };
  }

  async createBooking(dto: CreateBookingRequestDto) {
    const user = await this.usersService.findBySlug(dto.slug);

    if (!user) {
      throw new NotFoundException(`User with slug: "${dto.slug}" not found`);
    }

    const { weekday } = DATE_UTILS.getUtcDayBounds(dto.date);

    const day = await this.scheduleService.getUserScheduleByWeekday(user.id, weekday);

    if (!day) {
      throw new NotFoundException(`Can not find the schedule for this date: "${dto.date}"`);
    }

    if (day.startTime > dto.startTime || day.endTime < dto.endTime) {
      throw new BadRequestException('Invalid time');
    }

    if ((dto.startTime - day.startTime) % user.slotDurationMinutes !== 0) {
      throw new BadRequestException('Incorrect slot duration');
    }

    if (dto.endTime - dto.startTime !== user.slotDurationMinutes) {
      throw new BadRequestException('Invalid slot duration');
    }

    if (DATE_UTILS.minutesToUtcDate(dto.date, dto.startTime) < new Date()) {
      throw new BadRequestException('Time can not be in past');
    }

    const startTime = DATE_UTILS.minutesToUtcDate(dto.date, dto.startTime);
    const endTime = DATE_UTILS.minutesToUtcDate(dto.date, dto.endTime);

    const booking = await this.prismaService.booking.findFirst({
      where: { userId: user.id, startTime, endTime },
    });

    if (booking) {
      throw new AppException(
        ErrorCode.BOOKING_SLOT_UNAVAILABLE,
        HttpStatus.CONFLICT,
        'This slot is no longer available',
      );
    }

    try {
      const createdBooking = await this.prismaService.booking.create({
        data: {
          userId: user.id,
          clientName: dto.clientName,
          clientEmail: dto.clientEmail,
          clientPhone: dto.clientPhone,
          startTime,
          endTime,
        },
      });

      return createdBooking;
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
    return await this.prismaService.booking.findMany({ where: { userId }, orderBy: { startTime: 'desc' } });
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
