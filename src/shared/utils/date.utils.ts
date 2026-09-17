import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

const VALID_DATE_FORMAT_REGEXP = /^\d{4}-\d{2}-\d{2}$/;

function formatting(value: string | number): string {
  return value.toString().padStart(2, '0');
}

function getNextCalendarDate(dateString: string): string {
  if (!VALID_DATE_FORMAT_REGEXP.test(dateString)) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1));

  return `${nextDay.getUTCFullYear()}-${formatting(nextDay.getUTCMonth() + 1)}-${formatting(nextDay.getUTCDate())}`;
}

function minutesInTimeZoneToUtc(dateString: string, minutes: number, timeZone: string): Date {
  if (!VALID_DATE_FORMAT_REGEXP.test(dateString)) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }

  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 1440) {
    throw new Error(`Invalid minutes value: "${minutes}"`);
  }

  let normalizedDate = dateString;
  let normalizedMinutes = minutes;

  if (minutes === 1440) {
    normalizedDate = getNextCalendarDate(dateString);
    normalizedMinutes = 0;
  }

  const hours = formatting(Math.floor(normalizedMinutes / 60));
  const mins = formatting(normalizedMinutes % 60);

  return fromZonedTime(`${normalizedDate}T${hours}:${mins}`, timeZone);
}

function getDayBoundsInTimeZone(dateString: string, timeZone: string): { weekday: number; startAt: Date; endAt: Date } {
  if (!VALID_DATE_FORMAT_REGEXP.test(dateString)) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));

  return {
    weekday: calendarDate.getUTCDay(),
    startAt: minutesInTimeZoneToUtc(dateString, 0, timeZone),
    endAt: minutesInTimeZoneToUtc(getNextCalendarDate(dateString), 0, timeZone),
  };
}

function getDateAndMinutesInTimeZone(startAt: Date, timeZone: string): { date: string; minutes: number } {
  const date = formatInTimeZone(startAt, timeZone, 'yyyy-MM-dd');
  const hours = Number(formatInTimeZone(startAt, timeZone, 'HH'));
  const mins = Number(formatInTimeZone(startAt, timeZone, 'mm'));
  const minutes = hours * 60 + mins;

  return { date, minutes };
}

function getCalendarDatesInTimeZoneRange(startAt: Date, endAt: Date, timeZone: string): string[] {
  if (endAt <= startAt) {
    throw new Error('Range end must be after range start');
  }

  const startDate = getDateAndMinutesInTimeZone(startAt, timeZone).date;

  // endAt — исключающая граница диапазона,
  // поэтому берём последний момент, который реально входит в диапазон.
  const endInclusive = new Date(endAt.getTime() - 1);
  const endDate = getDateAndMinutesInTimeZone(endInclusive, timeZone).date;

  const dates: string[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = getNextCalendarDate(currentDate);
  }

  return dates;
}

export const DATE_UTILS = {
  getNextCalendarDate,
  minutesInTimeZoneToUtc,
  getDayBoundsInTimeZone,
  getDateAndMinutesInTimeZone,
  getCalendarDatesInTimeZoneRange,
};
