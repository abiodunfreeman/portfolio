import assert from 'node:assert/strict';
import test from 'node:test';
import { addDays, dateKey, formatDate, weekStart } from '../src/lib/dates';
import {
  createDemoApi,
  DEMO_STORAGE_KEY,
  seedDemoData,
  summaryForJobs,
} from '../src/lib/demo';
import type { JobInput } from '../src/lib/types';

const monday = new Date('2026-09-14T16:00:00Z');

class MemoryStorage {
  data = new Map<string, string>();
  failWrites = false;
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    if (this.failWrites) throw new Error('Quota exceeded');
    this.data.set(key, value);
  }
}

function exampleInput(overrides: Partial<JobInput> = {}): JobInput {
  return {
    title: 'New diagnostic request',
    description: 'Inspect the AC unit and provide a written estimate.',
    serviceType: 'diagnostic',
    status: 'scheduled',
    scheduledDate: '2026-09-14',
    scheduledTime: '15:00',
    durationMinutes: 60,
    amount: 89,
    customerId: 1,
    technicianId: 2,
    ...overrides,
  };
}

test('Cleveland calendar helpers handle UTC midnight, Sunday and daylight saving changes', () => {
  assert.equal(dateKey(new Date('2026-09-14T02:00:00Z')), '2026-09-13');
  assert.equal(dateKey(new Date('2026-09-14T04:00:00Z')), '2026-09-14');
  assert.equal(weekStart('2026-09-13'), '2026-09-07');
  assert.equal(weekStart('2026-09-14'), '2026-09-14');
  assert.equal(addDays('2026-03-07', 2), '2026-03-09');
  assert.equal(addDays('2026-11-01', -1), '2026-10-31');
  assert.equal(formatDate('2026-09-14'), 'Sep 14');
  assert.throws(() => addDays('2026-02-30', 1), /valid calendar date/);
});

test('offline data mirrors seed counts and Monday revenue without cancelled or prior-week work', () => {
  const data = seedDemoData(monday);
  assert.equal(data.customers.length, 12);
  assert.equal(data.technicians.length, 4);
  assert.equal(data.jobs.length, 15);
  assert.equal(data.jobs[0].reference, 'NC-1001');
  const summary = summaryForJobs(data.jobs, monday);
  assert.equal(summary.todayJobs, 9);
  assert.equal(summary.weekJobs, 14);
  assert.equal(summary.weekCompletedJobs, 4);
  assert.equal(summary.weeklyRevenue, 6489);
  assert.equal(summary.completionRate, 33);
  assert.deepEqual(summary.jobsByStatus, {
    scheduled: 6,
    'in-progress': 2,
    completed: 5,
    cancelled: 2,
  });
  assert.equal(summary.aiWeekSummary.mode, 'rules');
  assert.match(summary.aiWeekSummary.text, /\$6,489/);
});

test('Sunday excludes next-week jobs, includes Sunday completed work and keeps all-time status counts', () => {
  const sunday = new Date('2026-09-20T16:00:00Z');
  const data = seedDemoData(sunday);
  const summary = summaryForJobs(data.jobs, sunday);
  assert.equal(summary.weekStart, '2026-09-14');
  assert.equal(summary.weekEnd, '2026-09-20');
  assert.equal(summary.weekJobs, 10);
  assert.equal(summary.todayJobs, 6);
  assert.equal(summary.completionRate, 44);
  assert.equal(summary.weeklyRevenue, 6489);
  assert.equal(summary.totalJobs, 15);
});

test('an empty week has finite zero KPIs and a data-grounded rules summary', () => {
  const summary = summaryForJobs([], monday);
  assert.equal(summary.completionRate, 0);
  assert.equal(summary.weeklyRevenue, 0);
  assert.equal(summary.todayJobs, 0);
  assert.match(summary.aiWeekSummary.text, /0 of 0/);
});

test('new jobs and status updates persist across API instances and update summary calculations', async () => {
  const storage = new MemoryStorage();
  const api = createDemoApi(storage, () => monday);
  const created = await api.createJob(exampleInput());
  assert.equal(created.id, 16);
  assert.equal(created.reference, 'NC-1016');
  const reloaded = createDemoApi(storage, () => monday);
  assert.equal((await reloaded.getJobs()).length, 16);
  const updated = await reloaded.updateJob(
    created.id,
    exampleInput({ status: 'completed' }),
  );
  assert.equal(updated.status, 'completed');
  assert.equal(updated.createdAt, created.createdAt);
  assert.equal((await api.getSummary()).weeklyRevenue, 6578);
  updated.title = 'A client-side mutation';
  assert.equal(
    (await api.getJobs()).find((job) => job.id === 16)?.title,
    'New diagnostic request',
  );
});

test('storage write failures do not persist or return a false successful update', async () => {
  const storage = new MemoryStorage();
  const api = createDemoApi(storage, () => monday);
  await api.createJob(exampleInput());
  const before = storage.getItem(DEMO_STORAGE_KEY);
  storage.failWrites = true;
  await assert.rejects(
    api.updateJob(16, exampleInput({ status: 'completed' })),
    /Your change was not saved/,
  );
  assert.equal(storage.getItem(DEMO_STORAGE_KEY), before);
  assert.equal((await api.getJobs()).find((job) => job.id === 16)?.status, 'scheduled');
});

test('corrupted and inaccessible browser storage surface useful errors instead of overwriting jobs', async () => {
  const storage = new MemoryStorage();
  storage.setItem(DEMO_STORAGE_KEY, 'not-json');
  const api = createDemoApi(storage, () => monday);
  await assert.rejects(api.getJobs(), /could not be read/);
  await assert.rejects(api.createJob(exampleInput()), /could not be read/);
  assert.equal(storage.getItem(DEMO_STORAGE_KEY), 'not-json');
  const incompleteJobs = seedDemoData(monday).jobs;
  storage.setItem(
    DEMO_STORAGE_KEY,
    JSON.stringify([{ ...incompleteJobs[0], customer: { id: 1 } }]),
  );
  await assert.rejects(api.getJobs(), /could not be read/);
  const blocked = createDemoApi(
    {
      getItem() {
        throw new Error('Blocked');
      },
      setItem() {
        throw new Error('Blocked');
      },
    },
    () => monday,
  );
  await assert.rejects(blocked.getJobs(), /Enable browser storage/);
});

test('offline writes reject invalid API input and unknown job IDs', async () => {
  const storage = new MemoryStorage();
  const api = createDemoApi(storage, () => monday);
  const invalidInputs: Array<Partial<JobInput>> = [
    { title: '' },
    { description: 'x'.repeat(2001) },
    { scheduledDate: '2026-02-30' },
    { scheduledDate: '1999-12-31' },
    { scheduledTime: '25:00' },
    { customerId: 999 },
    { technicianId: 999 },
    { durationMinutes: 481 },
    { amount: -1 },
    { amount: 1.234 },
    { amount: 100001 },
  ];
  for (const input of invalidInputs) {
    await assert.rejects(api.createJob(exampleInput(input)));
  }
  await assert.rejects(api.updateJob(999, exampleInput()), /could not be found/);
  assert.equal(storage.getItem(DEMO_STORAGE_KEY), null);
  const optionalNotes = await api.createJob(exampleInput({ description: '' }));
  assert.equal(optionalNotes.description, '');
});
