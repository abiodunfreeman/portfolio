import assert from 'node:assert/strict';
import test from 'node:test';
import { createHttpApi, normalizeApiUrl } from '../src/lib/httpApi';
import { seedDemoData } from '../src/lib/demo';
import type { JobInput } from '../src/lib/types';

test('API URLs accept a host root or an existing /api prefix without duplication', () => {
  assert.equal(normalizeApiUrl(' https://hvac.example/ '), 'https://hvac.example/api');
  assert.equal(normalizeApiUrl('https://hvac.example/api/'), 'https://hvac.example/api');
  assert.equal(normalizeApiUrl('http://localhost:8080'), 'http://localhost:8080/api');
  assert.throws(() => normalizeApiUrl('file:///backend'));
  assert.throws(() => normalizeApiUrl('https://hvac.example?token=example'));
});

test('HTTP client routes GET and full job writes to the selected server', async () => {
  const sample = seedDemoData(new Date('2026-09-14T16:00:00Z')).jobs[0];
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchMock: typeof fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return Response.json(init?.method === 'GET' ? [sample] : sample);
  };
  const api = createHttpApi('https://hvac.example/api', fetchMock);
  const { customer, technician, ...fields } = sample;
  const input: JobInput = {
    ...fields,
    customerId: customer.id,
    technicianId: technician.id,
  };
  assert.equal((await api.getJobs())[0].id, sample.id);
  await api.getCustomers();
  await api.getTechnicians();
  await api.getSummary();
  await api.createJob(input);
  await api.updateJob(1, input);
  assert.deepEqual(
    calls.map((call) => call.url),
    [
      'https://hvac.example/api/jobs',
      'https://hvac.example/api/customers',
      'https://hvac.example/api/technicians',
      'https://hvac.example/api/dashboard/summary',
      'https://hvac.example/api/jobs',
      'https://hvac.example/api/jobs/1',
    ],
  );
  assert.equal(calls[4].init?.method, 'POST');
  assert.equal(calls[5].init?.method, 'PUT');
  assert.deepEqual(JSON.parse(String(calls[5].init?.body)), input);
});

test('configured API validation and network failures surface instead of using offline data', async () => {
  const invalid = createHttpApi('not-an-address', async () => {
    throw new Error('Must not fetch');
  });
  await assert.rejects(invalid.getJobs(), /API address is invalid/);
  const unavailable = createHttpApi('https://hvac.example', async () => {
    throw new TypeError('Failed to fetch');
  });
  await assert.rejects(unavailable.getJobs(), /API could not be reached/);
  const validation = createHttpApi('https://hvac.example', async () =>
    Response.json(
      {
        message: 'Invalid job details.',
        errors: { title: 'Title is required.' },
      },
      { status: 400 },
    ),
  );
  await assert.rejects(validation.getJobs(), /Invalid job details.*Title is required/);
});

test('invalid JSON and hosting error pages produce readable API errors', async () => {
  const invalidJson = createHttpApi(
    'https://hvac.example',
    async () => new Response('<html>Wrong site</html>'),
  );
  await assert.rejects(invalidJson.getJobs(), /unreadable response/);
  const gateway = createHttpApi(
    'https://hvac.example',
    async () => new Response('Starting', { status: 503 }),
  );
  await assert.rejects(gateway.getJobs(), /error \(503\)/);
});

test('slow API requests abort and explain the free-host wake-up retry', async () => {
  const slowFetch: typeof fetch = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () =>
        reject(new DOMException('Aborted', 'AbortError')),
      );
    });
  const api = createHttpApi('https://hvac.example', slowFetch, 5);
  await assert.rejects(api.getJobs(), /may be waking up.*retry/);
});
