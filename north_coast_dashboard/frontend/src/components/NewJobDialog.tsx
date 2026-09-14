import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material';
import { Plus, X } from 'lucide-react';
import type { Customer, JobInput, Technician } from '../lib/types';
import { dateKey } from '../lib/dates';
import { serviceTypes } from '../config';

export default function NewJobDialog({
  customers,
  technicians,
  onClose,
  onSave,
}: {
  customers: Customer[];
  technicians: Technician[];
  onClose: () => void;
  onSave: (input: JobInput) => Promise<void>;
}) {
  const [fields, setFields] = useState<JobInput>({
    title: '',
    description: '',
    customerId: 0,
    technicianId: 0,
    serviceType: 'diagnostic',
    status: 'scheduled',
    scheduledDate: dateKey(),
    scheduledTime: '09:00',
    durationMinutes: 60,
    amount: 89,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  function update<K extends keyof JobInput>(key: K, value: JobInput[K]) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!fields.title.trim() || !fields.customerId || !fields.technicianId) {
      setError('Add a title, and select a customer and technician.');
      return;
    }
    setBusy(true);
    try {
      await onSave({
        ...fields,
        title: fields.title.trim(),
        description: fields.description.trim(),
      });
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Unable to create this job. Please retry.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      fullWidth
      maxWidth="sm"
      aria-labelledby="new-job-title"
    >
      <form onSubmit={(event) => void submit(event)}>
        <DialogTitle component="div" id="new-job-title" className="new-job-title">
          <div>
            <span className="eyebrow">LET’S GET IT ON THE BOARD</span>
            <h2>Create a new job</h2>
          </div>
          <IconButton aria-label="Close new job form" onClick={onClose} disabled={busy}>
            <X size={21} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="new-job-grid">
            <TextField
              disabled={busy}
              className="form-full"
              autoFocus
              required
              label="Job title"
              value={fields.title}
              onChange={(event) => update('title', event.target.value)}
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />
            <TextField
              disabled={busy}
              select
              required
              label="Customer"
              value={fields.customerId || ''}
              onChange={(event) => update('customerId', Number(event.target.value))}
            >
              {customers.map((customer) => (
                <MenuItem value={customer.id} key={customer.id}>
                  {customer.name} · {customer.suburb}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={busy}
              select
              required
              label="Technician"
              value={fields.technicianId || ''}
              onChange={(event) => update('technicianId', Number(event.target.value))}
            >
              {technicians.map((technician) => (
                <MenuItem value={technician.id} key={technician.id}>
                  {technician.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={busy}
              select
              required
              className="form-full"
              label="Service type"
              value={fields.serviceType}
              onChange={(event) =>
                update('serviceType', event.target.value as JobInput['serviceType'])
              }
            >
              {serviceTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={busy}
              type="date"
              required
              label="Scheduled date"
              value={fields.scheduledDate}
              onChange={(event) => update('scheduledDate', event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              disabled={busy}
              type="time"
              required
              label="Start time (Eastern)"
              value={fields.scheduledTime}
              onChange={(event) => update('scheduledTime', event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              disabled={busy}
              type="number"
              required
              label="Duration (minutes)"
              value={fields.durationMinutes}
              onChange={(event) => update('durationMinutes', Number(event.target.value))}
              slotProps={{ htmlInput: { min: 15, max: 480, step: 1 } }}
            />
            <TextField
              disabled={busy}
              type="number"
              required
              label="Estimated amount ($)"
              value={fields.amount}
              onChange={(event) => update('amount', Number(event.target.value))}
              slotProps={{ htmlInput: { min: 0, max: 100000, step: 0.01 } }}
            />
            <TextField
              disabled={busy}
              className="form-full"
              label="Job notes (optional)"
              multiline
              minRows={3}
              value={fields.description}
              onChange={(event) => update('description', event.target.value)}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
            />
          </div>
          {error && (
            <Alert severity="error" className="mt-4">
              {error}
            </Alert>
          )}
          <p className="new-job-note">
            New jobs start as Scheduled. Use fictional details in this demo.
          </p>
        </DialogContent>
        <DialogActions className="new-job-actions">
          <Button disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={busy}
            type="submit"
            color="secondary"
            variant="contained"
            startIcon={<Plus size={17} />}
          >
            {busy ? 'Creating job…' : 'Create job'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
