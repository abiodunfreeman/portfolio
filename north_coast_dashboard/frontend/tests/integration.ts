import assert from 'node:assert/strict';
import { createHttpApi, normalizeApiUrl } from '../src/lib/httpApi';
import type { JobInput } from '../src/lib/types';

// Requires a running demo API. Temporarily updates one job and restores it in finally.
const baseUrl = process.env.TEST_API_URL || 'http://127.0.0.1:8080';
const health = await fetch(`${normalizeApiUrl(baseUrl)}/health`).then((response) =>
  response.json(),
);
assert.equal(health.application, 'north-coast-api');
assert.equal(health.storage, 'in-memory-demo');
const api = createHttpApi(baseUrl);
const [jobs, customers, technicians, summary] = await Promise.all([
  api.getJobs(),
  api.getCustomers(),
  api.getTechnicians(),
  api.getSummary(),
]);
assert.ok(customers.length > 0 && technicians.length > 0 && jobs.length > 0);
assert.equal(summary.totalJobs, jobs.length);
const job = jobs.find(
  (item) =>
    item.status === 'scheduled' &&
    item.scheduledDate >= summary.weekStart &&
    item.scheduledDate <= summary.weekEnd,
);
assert.ok(job, 'A scheduled job in the current week is needed for this demo check.');
const input: JobInput = {
  title: job.title,
  description: job.description,
  serviceType: job.serviceType,
  status: job.status,
  scheduledDate: job.scheduledDate,
  scheduledTime: job.scheduledTime.slice(0, 5),
  durationMinutes: job.durationMinutes,
  amount: job.amount,
  customerId: job.customer.id,
  technicianId: job.technician.id,
};
try {
  const saved = await api.updateJob(job.id, { ...input, status: 'completed' });
  assert.equal(saved.status, 'completed');
  assert.equal(saved.customer.id, job.customer.id);
  const refreshed = await api.getSummary();
  assert.ok(
    Math.abs(refreshed.weeklyRevenue - summary.weeklyRevenue - job.amount) < 0.01,
  );
  assert.equal(refreshed.weekCompletedJobs, summary.weekCompletedJobs + 1);
  assert.equal(refreshed.jobsByStatus.completed, summary.jobsByStatus.completed + 1);
  assert.ok(
    (await api.getJobs()).some(
      (item) => item.id === job.id && item.status === 'completed',
    ),
  );
} finally {
  await api.updateJob(job.id, input);
}
const restored = await api.getSummary();
assert.equal(restored.weeklyRevenue, summary.weeklyRevenue);
assert.equal(restored.totalJobs, summary.totalJobs);
console.log(
  `Live API integration passed: ${jobs.length} jobs, ${customers.length} customers, ${technicians.length} technicians. Status update, revenue recalculation, and restoration verified.`,
);
