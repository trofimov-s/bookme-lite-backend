import type { SlotItemResponseDto } from '../dto';

import type { Booking } from '@/generated/prisma/client';
import { DATE_UTILS } from '@/shared/utils/date.utils';

interface CalculateSlotsParams {
  bookings: Booking[];
  duration: number;
  scheduleStartTime: number;
  scheduleEndTime: number;
  date: string;
  timeZone: string;
}

function calculateSlots({
  bookings,
  duration,
  scheduleStartTime,
  scheduleEndTime,
  date,
  timeZone,
}: CalculateSlotsParams): SlotItemResponseDto[] {
  const slots: SlotItemResponseDto[] = [];

  for (let step = scheduleStartTime; step + duration <= scheduleEndTime;) {
    const slotStartAt = DATE_UTILS.minutesInTimeZoneToUtc(date, step, timeZone);
    const slotEndAt = DATE_UTILS.minutesInTimeZoneToUtc(date, step + duration, timeZone);
    const isLocked = bookings.some((booking) => slotStartAt < booking.endTime && booking.startTime < slotEndAt);

    const slot: SlotItemResponseDto = {
      startAt: slotStartAt,
      endAt: slotEndAt,
      isLocked,
    };

    slots.push(slot);

    step += duration;
  }

  return slots;
}

export const SLOTS_CALCULATION_UTILS = {
  calculateSlots,
};
