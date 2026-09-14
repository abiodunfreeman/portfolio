export const JOB_STATUSES = [
  'scheduled',
  'in-progress',
  'completed',
  'cancelled',
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const SERVICE_TYPES = [
  'ac-repair',
  'furnace-installation',
  'maintenance',
  'heat-pump',
  'thermostat',
  'diagnostic',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  suburb: string;
}

export interface Technician {
  id: number;
  name: string;
  initials: string;
  specialty: string;
  color: string;
}

export interface JobInput {
  title: string;
  description: string;
  serviceType: ServiceType;
  status: JobStatus;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  amount: number;
  customerId: number;
  technicianId: number;
}

export interface Job {
  id: number;
  reference: string;
  title: string;
  description: string;
  serviceType: ServiceType;
  status: JobStatus;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  amount: number;
  customer: Customer;
  technician: Technician;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  today: string;
  weekStart: string;
  weekEnd: string;
  todayJobs: number;
  weeklyRevenue: number;
  completionRate: number;
  totalJobs: number;
  weekJobs: number;
  weekCompletedJobs: number;
  jobsByStatus: Record<JobStatus, number>;
  aiWeekSummary: {
    text: string;
    mode: 'rules' | 'ai';
    generatedAt: string;
  };
}

export interface DashboardApi {
  getJobs(): Promise<Job[]>;
  getCustomers(): Promise<Customer[]>;
  getTechnicians(): Promise<Technician[]>;
  getSummary(): Promise<DashboardSummary>;
  createJob(input: JobInput): Promise<Job>;
  updateJob(id: number, input: JobInput): Promise<Job>;
}
