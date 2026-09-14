import type { JobStatus } from './lib/types';
export const statuses: { value: JobStatus; label: string; color: string }[] = [
  { value: 'scheduled', label: 'Scheduled', color: '#5977cb' },
  { value: 'in-progress', label: 'In progress', color: '#df8a29' },
  { value: 'completed', label: 'Completed', color: '#3a9c7d' },
  { value: 'cancelled', label: 'Cancelled', color: '#9a9fab' },
];
export const serviceTypes = [
  { value: 'ac-repair', label: 'AC repair' },
  { value: 'furnace-installation', label: 'Furnace installation' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'heat-pump', label: 'Heat pump service' },
  { value: 'thermostat', label: 'Thermostat' },
  { value: 'diagnostic', label: 'Diagnostic visit' },
] as const;
