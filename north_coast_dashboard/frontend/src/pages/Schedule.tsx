import { useState } from 'react';
import { Button, IconButton, MenuItem, TextField } from '@mui/material';
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Job, Technician } from '../lib/types';
import { addDays, dateKey, formatDate, weekStart } from '../lib/dates';
import { StatusBadge, TechAvatar, TimeLabel } from '../components/Shared';

export default function Schedule({
  jobs,
  technicians,
  onOpen,
  onNew,
}: {
  jobs: Job[];
  technicians: Technician[];
  onOpen: (job: Job) => void;
  onNew: () => void;
}) {
  const [start, setStart] = useState(weekStart());
  const [technician, setTechnician] = useState('');
  const today = dateKey();
  const dates = Array.from({ length: 7 }, (_item, index) => addDays(start, index));
  const active = jobs
    .filter(
      (job) =>
        (job.status === 'scheduled' || job.status === 'in-progress') &&
        (!technician || String(job.technician.id) === technician) &&
        job.scheduledDate >= start &&
        job.scheduledDate <= dates[6],
    )
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  return (
    <div className="page-content schedule-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE ROOM FOR A WELL-RUN WEEK</span>
          <h1>A plan for every visit.</h1>
          <p>Scheduled and in-progress work, organized by day and technician.</p>
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
      <section className="surface schedule-surface">
        <div className="schedule-toolbar">
          <div className="week-navigation">
            <span className="calendar-icon">
              <CalendarDays size={21} />
            </span>
            <div>
              <h2>
                {formatDate(start)} –{' '}
                {formatDate(dates[6], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h2>
              <p>
                {active.length} active visits this week <b>·</b> Eastern time
              </p>
            </div>
          </div>
          <div className="schedule-controls">
            <Button variant="outlined" size="small" onClick={() => setStart(weekStart())}>
              This week
            </Button>
            <div className="week-arrows">
              <IconButton
                aria-label="Previous week"
                onClick={() => setStart(addDays(start, -7))}
              >
                <ChevronLeft size={19} />
              </IconButton>
              <IconButton
                aria-label="Next week"
                onClick={() => setStart(addDays(start, 7))}
              >
                <ChevronRight size={19} />
              </IconButton>
            </div>
            <TextField
              select
              label="Technician"
              value={technician}
              onChange={(event) => setTechnician(event.target.value)}
            >
              <MenuItem value="">All technicians</MenuItem>
              {technicians.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
        <div
          className="calendar-scroll"
          tabIndex={0}
          aria-label="Week schedule; scroll horizontally on small screens"
        >
          <div className="week-grid">
            {dates.map((date) => {
              const dayJobs = active.filter((job) => job.scheduledDate === date);
              return (
                <section
                  className={`day-column ${date === today ? 'is-today' : ''}`}
                  key={date}
                >
                  <div className="day-heading">
                    <span>{formatDate(date, { weekday: 'short' })}</span>
                    <strong>{formatDate(date, { day: 'numeric' })}</strong>
                    {date === today ? (
                      <small>Today</small>
                    ) : (
                      <small>
                        {dayJobs.length} {dayJobs.length === 1 ? 'visit' : 'visits'}
                      </small>
                    )}
                  </div>
                  <div className="day-jobs">
                    {dayJobs.map((job) => (
                      <button
                        className={`schedule-job ${job.status}`}
                        key={job.id}
                        onClick={() => onOpen(job)}
                      >
                        <span className="schedule-time">
                          <TimeLabel time={job.scheduledTime} />
                        </span>
                        <strong>{job.title}</strong>
                        <span className="schedule-customer">{job.customer.name}</span>
                        <span className="schedule-suburb">{job.customer.suburb}</span>
                        <div>
                          <TechAvatar technician={job.technician} small />
                          <span>
                            {job.technician.name.split(' ')[0]}
                            <small>{job.durationMinutes} min</small>
                          </span>
                        </div>
                        {job.status === 'in-progress' && (
                          <span className="schedule-live">In progress</span>
                        )}
                      </button>
                    ))}
                    {!dayJobs.length && (
                      <div className="day-empty">
                        <span />
                        No visits scheduled
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        <div className="schedule-footer">
          <div>
            <StatusBadge status="scheduled" />
            <StatusBadge status="in-progress" />
          </div>
          <span>Open any visit to view its details.</span>
        </div>
      </section>
      <p className="page-footnote">
        The week runs Monday–Sunday. Completed and cancelled jobs remain available in
        Jobs.
      </p>
    </div>
  );
}
