import { addDays, dateKey, formatMoney, weekStart } from './dates';
import {
  JOB_STATUSES,
  SERVICE_TYPES,
  type Customer,
  type DashboardApi,
  type DashboardSummary,
  type Job,
  type JobInput,
  type JobStatus,
  type Technician,
  type ServiceType,
} from './types';

export const DEMO_STORAGE_KEY = 'north-coast-dashboard-jobs-v1';

export interface DemoData {
  customers: Customer[];
  technicians: Technician[];
  jobs: Job[];
}

type DemoStorage = Pick<Storage, 'getItem' | 'setItem'>;

const customerDetails = [
  ['Melissa Reynolds', 'Lakewood', '1482 Warren Road', '216'],
  ['James Thompson', 'Westlake', '27614 Center Ridge Road', '440'],
  ['Angela Martinez', 'Parma', '6218 Ridge Road', '216'],
  ['David Kowalski', 'Strongsville', '18224 Drake Road', '440'],
  ['Priya Shah', 'Beachwood', '24310 Fairmount Boulevard', '216'],
  ['Robert Lawson', 'Shaker Heights', '19814 Van Aken Boulevard', '216'],
  ['Nicole Bennett', 'Mentor', '7326 Lakeshore Boulevard', '440'],
  ['Marcus Johnson', 'Cleveland', '3216 West 44th Street', '216'],
  ['Elena Petrov', 'Lakewood', '1738 Marlowe Avenue', '216'],
  ["Brian O'Malley", 'Westlake', '25342 Detroit Road', '440'],
  ['Denise Walker', 'Parma', '5742 Pearl Road', '216'],
  ['Samuel Chen', 'Mentor', '8456 Johnnycake Ridge Road', '440'],
] as const;

const technicians: Technician[] = [
  {
    id: 1,
    name: 'Mike Sullivan',
    initials: 'MS',
    specialty: 'AC & heat pumps',
    color: '#477A9B',
  },
  {
    id: 2,
    name: 'Alicia Brooks',
    initials: 'AB',
    specialty: 'Furnaces & installation',
    color: '#9871B5',
  },
  {
    id: 3,
    name: 'Daniel Rivera',
    initials: 'DR',
    specialty: 'Maintenance & diagnostics',
    color: '#B87B48',
  },
  {
    id: 4,
    name: 'Jordan Price',
    initials: 'JP',
    specialty: 'Controls & indoor comfort',
    color: '#4F947C',
  },
];

/** Fictional records, with dates relative to Cleveland today so the demo stays useful. */
export function seedDemoData(now: Date = new Date()): DemoData {
  const today = dateKey(now);
  const monday = weekStart(today);
  const customers: Customer[] = customerDetails.map(
    ([name, suburb, address, areaCode], index) => ({
      id: index + 1,
      name,
      phone: `(${areaCode}) 555-${String(101 + index).padStart(4, '0')}`,
      email: `${name
        .toLowerCase()
        .replaceAll("'", '')
        .replace(/[^a-z]+/g, '.')}@example.com`,
      address,
      suburb,
    }),
  );

  const records: Array<{
    title: string;
    description: string;
    serviceType: ServiceType;
    status: JobStatus;
    date: string;
    time: string;
    duration: number;
    amount: number;
    customer: number;
    technician: number;
  }> = [
    {
      title: 'AC not cooling upstairs',
      description:
        'Inspect the condenser and refrigerant circuit. Customer reports warm air from second-floor vents.',
      serviceType: 'ac-repair',
      status: 'in-progress',
      date: today,
      time: '09:00',
      duration: 90,
      amount: 385,
      customer: 1,
      technician: 1,
    },
    {
      title: 'High-efficiency furnace installation',
      description:
        'Replace the aging furnace with a correctly sized high-efficiency unit; haul away old equipment and test operation.',
      serviceType: 'furnace-installation',
      status: 'scheduled',
      date: today,
      time: '10:30',
      duration: 300,
      amount: 6200,
      customer: 2,
      technician: 2,
    },
    {
      title: 'Comfort Club seasonal tune-up',
      description:
        'Complete the seasonal inspection, clean accessible components, and document filter and thermostat settings.',
      serviceType: 'maintenance',
      status: 'scheduled',
      date: today,
      time: '13:00',
      duration: 60,
      amount: 199,
      customer: 3,
      technician: 3,
    },
    {
      title: 'Smart thermostat setup',
      description:
        'Install the customer-approved smart thermostat and walk through scheduling and Wi-Fi controls.',
      serviceType: 'thermostat',
      status: 'scheduled',
      date: today,
      time: '15:00',
      duration: 75,
      amount: 295,
      customer: 5,
      technician: 4,
    },
    {
      title: 'Heat-pump performance check',
      description:
        'Evaluate uneven temperatures and review heat-pump operating performance before recommending repairs.',
      serviceType: 'heat-pump',
      status: 'scheduled',
      date: addDays(today, 1),
      time: '08:30',
      duration: 90,
      amount: 189,
      customer: 4,
      technician: 1,
    },
    {
      title: 'Furnace safety inspection',
      description:
        'Inspect burners, ignition, venting and safety controls as part of the annual maintenance visit.',
      serviceType: 'maintenance',
      status: 'scheduled',
      date: addDays(today, 2),
      time: '09:00',
      duration: 60,
      amount: 199,
      customer: 6,
      technician: 2,
    },
    {
      title: 'Cooling diagnostic visit',
      description:
        'Diagnose the intermittent system shutdown and provide an itemized repair estimate before proceeding.',
      serviceType: 'diagnostic',
      status: 'scheduled',
      date: addDays(today, 3),
      time: '11:00',
      duration: 60,
      amount: 89,
      customer: 7,
      technician: 3,
    },
    {
      title: 'AC capacitor replacement',
      description:
        'Replaced the failed run capacitor and verified startup amperage and cooling performance.',
      serviceType: 'ac-repair',
      status: 'completed',
      date: monday,
      time: '08:00',
      duration: 60,
      amount: 275,
      customer: 8,
      technician: 1,
    },
    {
      title: 'New furnace commissioning',
      description:
        'Completed furnace installation, combustion checks, thermostat setup and homeowner orientation.',
      serviceType: 'furnace-installation',
      status: 'completed',
      date: monday,
      time: '08:00',
      duration: 360,
      amount: 5850,
      customer: 9,
      technician: 2,
    },
    {
      title: 'Annual system maintenance',
      description:
        'Cleaned accessible coils, changed the supplied filter and completed the system performance checklist.',
      serviceType: 'maintenance',
      status: 'completed',
      date: monday,
      time: '08:00',
      duration: 60,
      amount: 199,
      customer: 10,
      technician: 3,
    },
    {
      title: 'Thermostat wiring repair',
      description:
        'Repaired a low-voltage connection and verified the thermostat controls heating and cooling correctly.',
      serviceType: 'thermostat',
      status: 'completed',
      date: today,
      time: '08:00',
      duration: 45,
      amount: 165,
      customer: 11,
      technician: 4,
    },
    {
      title: 'Blower motor replacement',
      description:
        'Installed the approved replacement blower motor and confirmed stable airflow throughout the home.',
      serviceType: 'ac-repair',
      status: 'completed',
      date: addDays(monday, -2),
      time: '10:00',
      duration: 120,
      amount: 745,
      customer: 12,
      technician: 1,
    },
    {
      title: 'Seasonal maintenance visit',
      description:
        'Customer requested cancellation after a change in travel plans. No service performed or charge applied.',
      serviceType: 'maintenance',
      status: 'cancelled',
      date: today,
      time: '14:30',
      duration: 60,
      amount: 199,
      customer: 1,
      technician: 3,
    },
    {
      title: 'Replacement furnace estimate',
      description:
        'Customer chose to postpone the equipment estimate until after planned home renovations.',
      serviceType: 'diagnostic',
      status: 'cancelled',
      date: addDays(today, 2),
      time: '15:30',
      duration: 60,
      amount: 89,
      customer: 4,
      technician: 2,
    },
    {
      title: 'No-cool system diagnosis',
      description:
        'Investigating a cooling interruption; customer approved the diagnostic visit before repair recommendations.',
      serviceType: 'diagnostic',
      status: 'in-progress',
      date: today,
      time: '11:30',
      duration: 90,
      amount: 89,
      customer: 8,
      technician: 1,
    },
  ];

  const timestamp = now.toISOString();
  const jobs = records.map((record, index): Job => ({
    id: index + 1,
    reference: `NC-${1001 + index}`,
    title: record.title,
    description: record.description,
    serviceType: record.serviceType,
    status: record.status,
    scheduledDate: record.date,
    scheduledTime: record.time,
    durationMinutes: record.duration,
    amount: record.amount,
    customer: customers[record.customer - 1],
    technician: technicians[record.technician - 1],
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  return structuredClone({ customers, technicians, jobs });
}

/** Revenue uses completed jobs' scheduled dates; cancelled jobs are not in completion rate. */
export function summaryForJobs(jobs: Job[], now: Date = new Date()): DashboardSummary {
  const today = dateKey(now);
  const monday = weekStart(today);
  const sunday = addDays(monday, 6);
  const weeklyJobs = jobs.filter(
    (job) => job.scheduledDate >= monday && job.scheduledDate <= sunday,
  );
  const completed = weeklyJobs.filter((job) => job.status === 'completed');
  const active = weeklyJobs.filter((job) => job.status !== 'cancelled');
  const weeklyRevenue =
    Math.round(completed.reduce((sum, job) => sum + job.amount, 0) * 100) / 100;
  const scheduled = weeklyJobs.filter((job) => job.status === 'scheduled').length;
  const inProgress = weeklyJobs.filter((job) => job.status === 'in-progress').length;
  const jobsByStatus: Record<JobStatus, number> = {
    scheduled: 0,
    'in-progress': 0,
    completed: 0,
    cancelled: 0,
  };
  for (const job of jobs) jobsByStatus[job.status] += 1;

  return {
    today,
    weekStart: monday,
    weekEnd: sunday,
    todayJobs: jobs.filter(
      (job) => job.scheduledDate === today && job.status !== 'cancelled',
    ).length,
    weeklyRevenue,
    completionRate: active.length
      ? Math.round((completed.length / active.length) * 100)
      : 0,
    totalJobs: jobs.length,
    weekJobs: weeklyJobs.length,
    weekCompletedJobs: completed.length,
    jobsByStatus,
    aiWeekSummary: {
      mode: 'rules',
      generatedAt: now.toISOString(),
      text: `This week, ${completed.length} of ${active.length} non-cancelled jobs are complete, totaling ${formatMoney(weeklyRevenue)} in completed work. ${scheduled} ${scheduled === 1 ? 'job is' : 'jobs are'} scheduled and ${inProgress} ${inProgress === 1 ? 'is' : 'are'} in progress. ${scheduled > 0 ? 'Review upcoming assignments to keep the week moving.' : 'Review the schedule for new service requests.'}`,
    },
  };
}

function validateInput(input: JobInput, data: DemoData): void {
  if (!input.title.trim() || input.title.length > 120)
    throw new Error('Enter a job title of 1–120 characters.');
  if (input.description.length > 2000)
    throw new Error('Keep job notes under 2,000 characters.');
  if (!SERVICE_TYPES.includes(input.serviceType))
    throw new Error('Select a valid service type.');
  if (!JOB_STATUSES.includes(input.status)) throw new Error('Select a valid job status.');
  addDays(input.scheduledDate, 0);
  if (input.scheduledDate < '2000-01-01' || input.scheduledDate > '2100-12-31')
    throw new Error('Choose a date between 2000 and 2100.');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.scheduledTime))
    throw new Error('Enter a valid time.');
  if (
    !Number.isInteger(input.durationMinutes) ||
    input.durationMinutes < 15 ||
    input.durationMinutes > 480
  )
    throw new Error('Duration must be between 15 and 480 minutes.');
  if (
    !Number.isFinite(input.amount) ||
    input.amount < 0 ||
    input.amount > 100000 ||
    Math.abs(input.amount * 100 - Math.round(input.amount * 100)) > 0.000001
  )
    throw new Error('Enter an amount from 0 to 100,000 with at most two decimal places.');
  if (!data.customers.some((customer) => customer.id === input.customerId))
    throw new Error('Select a customer.');
  if (!data.technicians.some((technician) => technician.id === input.technicianId))
    throw new Error('Select a technician.');
}

function isStoredJob(value: unknown): value is Job {
  if (!value || typeof value !== 'object') return false;
  const job = value as Partial<Job>;
  return (
    typeof job.id === 'number' &&
    Number.isInteger(job.id) &&
    job.id > 0 &&
    typeof job.reference === 'string' &&
    typeof job.title === 'string' &&
    typeof job.description === 'string' &&
    SERVICE_TYPES.includes(job.serviceType as ServiceType) &&
    JOB_STATUSES.includes(job.status as JobStatus) &&
    typeof job.scheduledDate === 'string' &&
    typeof job.scheduledTime === 'string' &&
    typeof job.durationMinutes === 'number' &&
    typeof job.amount === 'number' &&
    typeof job.customer?.id === 'number' &&
    ['name', 'phone', 'email', 'address', 'suburb'].every(
      (field) => typeof job.customer?.[field as keyof Customer] === 'string',
    ) &&
    typeof job.technician?.id === 'number' &&
    ['name', 'initials', 'specialty', 'color'].every(
      (field) => typeof job.technician?.[field as keyof Technician] === 'string',
    ) &&
    typeof job.createdAt === 'string' &&
    typeof job.updatedAt === 'string'
  );
}

/** Writes succeed only after localStorage confirms the write; failed saves never change the returned data. */
export function createDemoApi(
  storage: DemoStorage,
  clock: () => Date = () => new Date(),
): DashboardApi {
  const data = seedDemoData(clock());

  function readJobs(): Job[] {
    try {
      const saved = storage.getItem(DEMO_STORAGE_KEY);
      if (!saved) return structuredClone(data.jobs);
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(isStoredJob))
        throw new Error('Invalid stored jobs');
      if (new Set(parsed.map((job) => job.id)).size !== parsed.length)
        throw new Error('Duplicate stored job IDs');
      for (const job of parsed) {
        validateInput(
          { ...job, customerId: job.customer.id, technicianId: job.technician.id },
          data,
        );
      }
      return parsed;
    } catch {
      throw new Error(
        'Saved demo jobs could not be read. Enable browser storage, or clear this demo’s saved data and retry.',
      );
    }
  }

  function saveJobs(jobs: Job[]): void {
    try {
      storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(jobs));
    } catch {
      throw new Error(
        'The job could not be saved in this browser. Enable local storage or free some space, then try again. Your change was not saved.',
      );
    }
  }

  function buildJob(input: JobInput, existing?: Job): Job {
    validateInput(input, data);
    const timestamp = clock().toISOString();
    const id = existing?.id ?? Math.max(0, ...readJobs().map((job) => job.id)) + 1;
    return {
      id,
      reference: existing?.reference ?? `NC-${1000 + id}`,
      title: input.title.trim(),
      description: input.description.trim(),
      serviceType: input.serviceType,
      status: input.status,
      scheduledDate: input.scheduledDate,
      scheduledTime: input.scheduledTime,
      durationMinutes: input.durationMinutes,
      amount: Math.round(input.amount * 100) / 100,
      customer: data.customers.find((customer) => customer.id === input.customerId)!,
      technician: data.technicians.find(
        (technician) => technician.id === input.technicianId,
      )!,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
  }

  return {
    async getJobs() {
      return readJobs();
    },
    async getCustomers() {
      return structuredClone(data.customers);
    },
    async getTechnicians() {
      return structuredClone(data.technicians);
    },
    async getSummary() {
      return summaryForJobs(readJobs(), clock());
    },
    async createJob(input) {
      const jobs = readJobs();
      const job = buildJob(input);
      saveJobs([...jobs, job]);
      return structuredClone(job);
    },
    async updateJob(id, input) {
      const jobs = readJobs();
      const existing = jobs.find((job) => job.id === id);
      if (!existing)
        throw new Error(
          'This job could not be found. Refresh the jobs list and try again.',
        );
      const job = buildJob(input, existing);
      saveJobs(jobs.map((previous) => (previous.id === id ? job : previous)));
      return structuredClone(job);
    },
  };
}
