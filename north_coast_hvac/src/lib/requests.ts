import { serviceOptions } from '../../shared/business';

export const STORAGE_KEY = 'north-coast-demo-requests-v1';
export type BookingFields = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
};
export type DemoRequest = {
  id: string;
  kind: 'booking' | 'callback';
  name: string;
  phone: string;
  createdAt: string;
  service?: string;
  date?: string;
  time?: string;
};
export const timeOptions = ['Morning · 8am–noon', 'Afternoon · noon–6pm'];

export function validPhone(value: string) {
  if (!/^[+\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}

export function validName(value: string) {
  return value.trim().length >= 2 && value.trim().length <= 80 && /\p{L}/u.test(value);
}

export function clevelandToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function validDate(value: string, today = clevelandToday()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < today) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function bookingErrors(fields: BookingFields, today = clevelandToday()) {
  const errors: Partial<Record<keyof BookingFields, string>> = {};
  if (!validName(fields.name)) errors.name = 'Enter a name between 2 and 80 characters.';
  if (!validPhone(fields.phone)) errors.phone = 'Enter a 10-digit US phone number.';
  if (!serviceOptions.some((option) => option.id === fields.service))
    errors.service = 'Choose a service.';
  if (!validDate(fields.date, today)) errors.date = 'Choose today or a future date.';
  if (!timeOptions.includes(fields.time)) errors.time = 'Choose a preferred time window.';
  return errors;
}

export function saveRequest(
  request: DemoRequest,
  storage?: Pick<Storage, 'getItem' | 'setItem'>,
) {
  try {
    const target = storage ?? localStorage;
    const raw = target.getItem(STORAGE_KEY);
    const previous: unknown = raw ? JSON.parse(raw) : [];
    if (
      !Array.isArray(previous) ||
      !previous.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          (item.kind === 'booking' || item.kind === 'callback'),
      )
    )
      throw new Error('Invalid stored requests');
    target.setItem(STORAGE_KEY, JSON.stringify([...previous, request]));
  } catch {
    throw new Error(
      'Your request could not be saved in this browser. Enable browser storage or clear this demo’s saved data, then try again. Nothing was submitted.',
    );
  }
}

export function requestId() {
  return `NC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
export function displayDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  }).format(new Date(`${value}T12:00:00Z`));
}
