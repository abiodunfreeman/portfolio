import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  bookingErrors,
  clevelandToday,
  displayDate,
  saveRequest,
  STORAGE_KEY,
  timeOptions,
  validDate,
  validName,
  validPhone,
  type BookingFields,
  type DemoRequest,
} from '../src/lib/requests.ts';

const fields: BookingFields = {
  name: 'Alex Demo',
  phone: '(216) 555-0100',
  service: 'ac-repair',
  date: '2027-06-15',
  time: timeOptions[0],
};
const booking: DemoRequest = {
  ...fields,
  id: 'NC-TESTBOOK',
  kind: 'booking',
  createdAt: '2027-06-01T12:00:00Z',
};

test('booking validation catches missing or invalid fields and accepts a complete request', () => {
  assert.deepEqual(bookingErrors(fields, '2027-06-01'), {});
  assert.deepEqual(
    Object.keys(
      bookingErrors(
        { name: '', phone: '123', service: 'invented', date: '2027-02-30', time: '3 AM' },
        '2027-06-01',
      ),
    ),
    ['name', 'phone', 'service', 'date', 'time'],
  );
  assert.equal(validName('A'), false);
  assert.equal(validName('1234'), false);
  assert.equal(validName('José Demo'), true);
  for (const value of ['2165550100', '+1 (216) 555-0100', '216.555.0100'])
    assert.equal(validPhone(value), true);
  for (const value of ['123', '22165550100', '216CALLNOW', '2165550100 ext 2'])
    assert.equal(validPhone(value), false);
});

test('preferred dates use Cleveland time and reject impossible or past dates', () => {
  assert.equal(clevelandToday(new Date('2027-06-02T02:00:00Z')), '2027-06-01');
  assert.equal(clevelandToday(new Date('2027-01-02T04:00:00Z')), '2027-01-01');
  assert.equal(validDate('2027-06-01', '2027-06-01'), true);
  assert.equal(validDate('2027-05-31', '2027-06-01'), false);
  assert.equal(validDate('2028-02-29', '2027-06-01'), true);
  assert.equal(validDate('2027-02-29', '2027-01-01'), false);
  assert.equal(validDate('2027-13-01', '2027-01-01'), false);
  assert.equal(displayDate('2027-06-15'), 'June 15, 2027');
});

test('booking and callback submissions append to the same persistent demo storage', () => {
  const map = new Map<string, string>();
  const storage = {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
  saveRequest(booking, storage);
  const callback: DemoRequest = {
    id: 'NC-TESTCALL',
    kind: 'callback',
    name: 'Sam Demo',
    phone: '2165550101',
    createdAt: '2027-06-01T13:00:00Z',
  };
  // A new storage adapter simulates a later visit reading the existing data.
  saveRequest(callback, { ...storage });
  assert.deepEqual(JSON.parse(map.get(STORAGE_KEY)!), [booking, callback]);
});

test('corrupt or unavailable storage produces an error without replacing existing data', () => {
  for (const raw of ['invalid json', '{}', '[{"id":"x","kind":"unexpected"}]']) {
    let writes = 0;
    assert.throws(
      () =>
        saveRequest(booking, {
          getItem: () => raw,
          setItem: () => {
            writes += 1;
          },
        }),
      /Nothing was submitted/,
    );
    assert.equal(writes, 0);
  }
  assert.throws(
    () =>
      saveRequest(booking, {
        getItem: () => {
          throw new Error('Storage disabled');
        },
        setItem: () => {},
      }),
    /Nothing was submitted/,
  );
  assert.throws(
    () =>
      saveRequest(booking, {
        getItem: () => null,
        setItem: () => {
          throw new Error('Quota exceeded');
        },
      }),
    /Nothing was submitted/,
  );
});
