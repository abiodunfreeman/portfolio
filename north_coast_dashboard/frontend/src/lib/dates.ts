export const BUSINESS_TIME_ZONE = 'America/New_York';

/** Calendar dates in Cleveland stay stable when a visitor uses another time zone. */
export function dateKey(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return ['year', 'month', 'day']
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join('-');
}

function calendarDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Use a calendar date in YYYY-MM-DD format.');
  }

  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error('Enter a valid calendar date.');
  }

  return date;
}

export function addDays(dateISO: string, days: number): string {
  const date = calendarDate(dateISO);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** The operational week starts on Monday, in the company's Cleveland time zone. */
export function weekStart(dateISO: string = dateKey()): string {
  const day = calendarDate(dateISO).getUTCDay();
  return addDays(dateISO, -((day + 6) % 7));
}

export function formatDate(
  dateISO: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
): string {
  return new Intl.DateTimeFormat('en-US', {
    ...options,
    timeZone: BUSINESS_TIME_ZONE,
  }).format(calendarDate(dateISO));
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
