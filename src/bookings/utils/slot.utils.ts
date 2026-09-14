import type { SlotItemResponseDto } from '../dto';

import type { Booking } from '@/generated/prisma/client';
import { DATE_UTILS } from '@/shared/utils/date.utils';

function calculateSlots(
  bookings: Booking[],
  duration: number,
  startTime: number,
  endTime: number,
): SlotItemResponseDto[] {
  const lockedSlots = calculateLockedSlots(bookings);
  const slots: SlotItemResponseDto[] = [];

  for (let step = startTime; step + duration <= endTime;) {
    const currStartTime = step;
    const currEndtime = step + duration;
    const isLocked = lockedSlots.some(([busyStart, busyEnd]) => currStartTime < busyEnd && busyStart < currEndtime);

    const slot: SlotItemResponseDto = {
      startTime: currStartTime,
      endTime: currEndtime,
      isLocked,
    };

    slots.push(slot);

    step += duration;
  }

  return slots;
}

function calculateLockedSlots(bookings: Booking[]): [number, number][] {
  return bookings.map((item) => [DATE_UTILS.dateToMinutes(item.startTime), DATE_UTILS.dateToMinutes(item.endTime)]);
}

export const SLOTS_CALCULATION_UTILS = {
  calculateSlots,
};
