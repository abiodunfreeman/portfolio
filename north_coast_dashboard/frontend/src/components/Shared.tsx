import { ArrowUpRight, CalendarDays, ChevronRight } from 'lucide-react';
import type { Job, JobStatus, Technician } from '../lib/types';
import { statuses } from '../config';
import { formatDate } from '../lib/dates';

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`status-badge ${status}`}>
      <i />
      {statuses.find((item) => item.value === status)?.label}
    </span>
  );
}
export function TechAvatar({
  technician,
  small = false,
}: {
  technician: Technician;
  small?: boolean;
}) {
  return (
    <span
      className={`tech-avatar ${small ? 'small' : ''}`}
      style={{ backgroundColor: `${technician.color}18`, color: technician.color }}
    >
      {technician.initials}
    </span>
  );
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <CalendarDays size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function TimeLabel({ time }: { time: string }) {
  const [hour, minute] = time.split(':').map(Number);
  return (
    <>
      {hour % 12 || 12}:{String(minute).padStart(2, '0')}{' '}
      <span className="time-period">{hour >= 12 ? 'PM' : 'AM'}</span>
    </>
  );
}
export function CompactJob({
  job,
  onOpen,
  showDate = false,
}: {
  job: Job;
  onOpen: (job: Job) => void;
  showDate?: boolean;
}) {
  return (
    <button className="compact-job" onClick={() => onOpen(job)}>
      <div className="job-time">
        {showDate && <small>{formatDate(job.scheduledDate)}</small>}
        <strong>
          <TimeLabel time={job.scheduledTime} />
        </strong>
        <span>{job.durationMinutes} min</span>
      </div>
      <div className="compact-job-info">
        <strong>{job.title}</strong>
        <span>
          {job.customer.name} <b>·</b> {job.customer.suburb}
        </span>
      </div>
      <div className="compact-job-status">
        <StatusBadge status={job.status} />
      </div>
      <TechAvatar technician={job.technician} small />
      <ChevronRight size={16} className="row-arrow" />
    </button>
  );
}
export function MetricChange({ children }: { children: React.ReactNode }) {
  return (
    <span className="metric-detail">
      <ArrowUpRight size={14} />
      {children}
    </span>
  );
}
