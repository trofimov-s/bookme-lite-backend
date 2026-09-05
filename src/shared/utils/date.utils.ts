const VALID_DATE_FORMAT_REGEXP = /^\d{4}-\d{2}-\d{2}$/;

function getUtcDayBounds(dateString: string): {
  weekday: number;
  startOfDay: Date;
  endOfDay: Date;
} {
  if (!VALID_DATE_FORMAT_REGEXP.test(dateString)) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }

  const [year, month, day] = dateString.split('-').map(Number);

  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  const weekday = startOfDay.getUTCDay();

  return { weekday, startOfDay, endOfDay };
}

function minutesToUtcDate(dateString: string, minutes: number): Date {
  if (!VALID_DATE_FORMAT_REGEXP.test(dateString)) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return new Date(Date.UTC(year, month - 1, day, hours, mins, 0, 0));
}

function dateToMinutes(date: Date): number {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

export const DATE_UTILS = {
  getUtcDayBounds,
  minutesToUtcDate,
  dateToMinutes,
};
