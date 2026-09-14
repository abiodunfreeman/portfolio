import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCheck,
  CircleDollarSign,
  Clock3,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react';
import type { DashboardSummary, Job, Technician } from '../lib/types';
import { formatDate, formatMoney } from '../lib/dates';
import { statuses } from '../config';
import { CompactJob, EmptyState, TechAvatar } from '../components/Shared';

type Props = {
  jobs: Job[];
  technicians: Technician[];
  summary: DashboardSummary;
  onOpen: (job: Job) => void;
  onNew: () => void;
};
export default function Overview({ jobs, technicians, summary, onOpen, onNew }: Props) {
  const todayJobs = jobs
    .filter((job) => job.scheduledDate === summary.today && job.status !== 'cancelled')
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  const date = formatDate(summary.today, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR OPERATIONS, IN SYNC</span>
          <h1>
            A little more organized.
            <br className="mobile-heading-break" /> A lot more comfortable.
          </h1>
          <p>Here’s what’s happening at North Coast today.</p>
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={onNew}
          startIcon={<Plus size={18} />}
        >
          New job
        </Button>
      </div>
      <div className="overview-dateline">
        <span>
          <CalendarDays size={16} />
          {date}
        </span>
        <span>
          Week of {formatDate(summary.weekStart)} – {formatDate(summary.weekEnd)}
        </span>
      </div>
      <div className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-label">
            Today’s jobs
            <span className="kpi-icon blue">
              <BriefcaseBusiness size={19} />
            </span>
          </div>
          <strong className="kpi-value">
            {summary.todayJobs}
            <span>jobs</span>
          </strong>
          <div className="kpi-caption">
            <i className="live-dot" />
            {todayJobs.filter((job) => job.status === 'in-progress').length} in progress
            right now
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-label">
            Weekly revenue
            <span className="kpi-icon green">
              <CircleDollarSign size={20} />
            </span>
          </div>
          <strong className="kpi-value">{formatMoney(summary.weeklyRevenue)}</strong>
          <div className="kpi-caption">
            From {summary.weekCompletedJobs} completed jobs this week
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-label">
            Completion rate
            <span className="kpi-icon orange">
              <CheckCheck size={20} />
            </span>
          </div>
          <strong className="kpi-value">
            {summary.completionRate}
            <span>%</span>
          </strong>
          <div
            className="kpi-progress"
            role="meter"
            aria-label="Weekly completion rate"
            aria-valuenow={summary.completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${summary.completionRate}%` }} />
          </div>
          <div className="kpi-caption">This week · excludes cancelled jobs</div>
        </article>
        <article className="kpi-card team-kpi">
          <div className="kpi-label">
            Your field team
            <span className="kpi-icon purple">
              <Users size={19} />
            </span>
          </div>
          <div className="crew-kpi">
            <strong className="kpi-value">{technicians.length}</strong>
            <div className="avatar-stack">
              {technicians.map((technician) => (
                <TechAvatar key={technician.id} technician={technician} small />
              ))}
            </div>
          </div>
          <div className="kpi-caption">Keeping Greater Cleveland comfortable</div>
        </article>
      </div>
      <div className="overview-grid">
        <section className="surface today-card">
          <div className="card-heading">
            <div>
              <h2>
                On the board today <span className="count-pill">{todayJobs.length}</span>
              </h2>
              <p>The day’s work, from first call to final check.</p>
            </div>
            <Button
              component={Link}
              to="/jobs"
              size="small"
              endIcon={<ArrowRight size={15} />}
            >
              All jobs
            </Button>
          </div>
          <div className="today-list">
            {todayJobs.length ? (
              todayJobs.map((job) => (
                <CompactJob key={job.id} job={job} onOpen={onOpen} />
              ))
            ) : (
              <EmptyState
                title="A clear day ahead"
                description="There are no active jobs on today’s board. Add a job or explore the schedule."
              />
            )}
          </div>
          <Link className="card-footer-link" to="/schedule">
            <CalendarDays size={16} /> Open the full schedule <ArrowRight size={15} />
          </Link>
        </section>
        <div className="overview-side">
          <section className="ai-card">
            <div className="ai-heading">
              <span>
                <Sparkles size={20} />
              </span>
              <span className="ai-label">YOUR WEEK, MADE SIMPLE</span>
            </div>
            <h2>AI week summary</h2>
            <p className="ai-summary-text">{summary.aiWeekSummary.text}</p>
            <div className="ai-footer">
              <span>
                <i />
                {summary.aiWeekSummary.mode === 'ai'
                  ? 'AI-generated from job totals'
                  : 'Data-generated demo · no AI model'}
              </span>
              <small>Updates when your job data changes</small>
            </div>
          </section>
          <section className="surface status-card">
            <div className="card-heading">
              <div>
                <h2>Jobs by status</h2>
                <p>{summary.totalJobs} jobs across your workspace</p>
              </div>
              <BriefcaseBusiness size={18} />
            </div>
            <div
              className="status-bar"
              aria-label={`${summary.totalJobs} total jobs by status`}
            >
              {statuses.map((status) => (
                <span
                  key={status.value}
                  style={{
                    background: status.color,
                    flex: summary.jobsByStatus[status.value],
                  }}
                  title={`${status.label}: ${summary.jobsByStatus[status.value]}`}
                />
              ))}
            </div>
            <div className="status-legend">
              {statuses.map((status) => (
                <Link to={`/jobs?status=${status.value}`} key={status.value}>
                  <span>
                    <i style={{ background: status.color }} />
                    {status.label}
                  </span>
                  <strong>{summary.jobsByStatus[status.value]}</strong>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
      <section className="surface crew-card">
        <div className="card-heading">
          <div>
            <h2>Good people. Great service.</h2>
            <p>Your technicians and their work for today.</p>
          </div>
          <span className="muted text-xs">
            <Clock3 size={14} className="mr-1 inline" />
            Eastern time
          </span>
        </div>
        <div className="crew-grid">
          {technicians.map((technician) => {
            const assigned = todayJobs.filter(
              (job) => job.technician.id === technician.id,
            );
            return (
              <Link
                to={`/jobs?technician=${technician.id}&date=${summary.today}`}
                className="crew-person"
                key={technician.id}
              >
                <TechAvatar technician={technician} />
                <div>
                  <strong>{technician.name}</strong>
                  <span>{technician.specialty}</span>
                  <small>
                    {assigned.length} {assigned.length === 1 ? 'job' : 'jobs'} today
                  </small>
                </div>
                <ArrowRight size={16} />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
