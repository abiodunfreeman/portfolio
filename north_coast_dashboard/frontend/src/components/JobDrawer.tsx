import { useState } from 'react';
import { Alert, Button, Drawer, IconButton, MenuItem, TextField } from '@mui/material';
import { CalendarDays, Check, Clock3, MapPin, Phone, X } from 'lucide-react';
import type { Job, JobInput, JobStatus } from '../lib/types';
import { formatDate, formatMoney } from '../lib/dates';
import { serviceTypes, statuses } from '../config';
import { StatusBadge, TechAvatar, TimeLabel } from './Shared';

export default function JobDrawer({
  job,
  onClose,
  onSave,
}: {
  job: Job;
  onClose: () => void;
  onSave: (input: JobInput, id: number) => Promise<void>;
}) {
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save() {
    setBusy(true);
    setError('');
    try {
      await onSave(
        {
          title: job.title,
          description: job.description,
          serviceType: job.serviceType,
          status,
          scheduledDate: job.scheduledDate,
          scheduledTime: job.scheduledTime.slice(0, 5),
          durationMinutes: job.durationMinutes,
          amount: job.amount,
          customerId: job.customer.id,
          technicianId: job.technician.id,
        },
        job.id,
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Unable to save this change. Please retry.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Drawer
      anchor="right"
      open
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <section
        className="job-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-detail-title"
      >
        <div className="drawer-top">
          <span className="job-reference">{job.reference}</span>
          <IconButton
            autoFocus
            aria-label="Close job details"
            onClick={onClose}
            disabled={busy}
          >
            <X size={21} />
          </IconButton>
        </div>
        <StatusBadge status={job.status} />
        <h2 id="job-detail-title">{job.title}</h2>
        <p className="drawer-service">
          {serviceTypes.find((service) => service.value === job.serviceType)?.label}
        </p>
        <div className="job-schedule-details">
          <span>
            <CalendarDays size={17} />
            <div>
              <strong>
                {formatDate(job.scheduledDate, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
              <small>Scheduled date</small>
            </div>
          </span>
          <span>
            <Clock3 size={17} />
            <div>
              <strong>
                <TimeLabel time={job.scheduledTime} /> · {job.durationMinutes} min
              </strong>
              <small>Eastern time</small>
            </div>
          </span>
        </div>
        <div className="drawer-section">
          <h3>Customer & location</h3>
          <strong>{job.customer.name}</strong>
          <span>
            <MapPin size={15} />
            {job.customer.address}
            <br />
            {job.customer.suburb}, OH
          </span>
          <span>
            <Phone size={15} />
            {job.customer.phone}
          </span>
          <small>Fictional sample customer</small>
        </div>
        <div className="drawer-section">
          <h3>Assigned technician</h3>
          <div className="drawer-technician">
            <TechAvatar technician={job.technician} />
            <div>
              <strong>{job.technician.name}</strong>
              <span>{job.technician.specialty}</span>
            </div>
          </div>
        </div>
        <div className="drawer-section">
          <h3>Job notes</h3>
          <p>{job.description}</p>
        </div>
        <div className="job-amount-box">
          <span>
            {job.status === 'completed' ? 'Completed job amount' : 'Estimated job amount'}
          </span>
          <strong>{formatMoney(job.amount)}</strong>
        </div>
        <div className="drawer-status-form">
          <h3>Keep the team up to date</h3>
          <p>Changes appear across the overview, schedule, and customer history.</p>
          <TextField
            select
            label="Job status"
            value={status}
            disabled={busy}
            onChange={(event) => setStatus(event.target.value as JobStatus)}
          >
            {statuses.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            startIcon={<Check size={17} />}
            disabled={busy || status === job.status}
            onClick={() => void save()}
          >
            {busy ? 'Saving change…' : 'Save status'}
          </Button>
        </div>
      </section>
    </Drawer>
  );
}
