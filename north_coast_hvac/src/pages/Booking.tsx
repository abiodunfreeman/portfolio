import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { business, serviceOptions } from '../../shared/business';
import {
  bookingErrors,
  clevelandToday,
  displayDate,
  requestId,
  saveRequest,
  timeOptions,
  type BookingFields,
  type DemoRequest,
} from '../lib/requests';

export default function Booking() {
  const [search] = useSearchParams();
  const initialService = serviceOptions.some(
    (service) => service.id === search.get('service'),
  )
    ? search.get('service')!
    : '';
  const [fields, setFields] = useState<BookingFields>({
    name: '',
    phone: '',
    service: initialService,
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFields, string>>>({});
  const [consent, setConsent] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [confirmation, setConfirmation] = useState<DemoRequest | null>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const returnToForm = useRef(false);

  useEffect(() => {
    if (confirmation) confirmationRef.current?.focus();
    else if (returnToForm.current) {
      document.getElementById('booking-name')?.focus();
      returnToForm.current = false;
    }
  }, [confirmation]);

  function update(field: keyof BookingFields, value: string) {
    setFields((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = bookingErrors(fields);
    setErrors(validation);
    setSaveError('');
    if (Object.keys(validation).length) {
      document.getElementById(`booking-${Object.keys(validation)[0]}`)?.focus();
      return;
    }
    if (!consent) {
      setSaveError('Please confirm you understand this is a local demo request.');
      return;
    }
    const request: DemoRequest = {
      ...fields,
      name: fields.name.trim(),
      phone: fields.phone.trim(),
      id: requestId(),
      kind: 'booking',
      createdAt: new Date().toISOString(),
    };
    try {
      // LIVE INTEGRATION: replace this save with POST to your Spring Boot endpoint,
      // e.g. await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type':
      // 'application/json' }, body: JSON.stringify(request) }). Check response.ok
      // before showing success; let the backend validate and confirm availability.
      saveRequest(request);
      setConfirmation(request);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Unable to save. Please try again.',
      );
    }
  }

  if (confirmation)
    return (
      <section className="shell confirmation-section" aria-live="polite">
        <div className="confirmation-card">
          <span className="confirmation-icon">
            <CircleCheck size={40} />
          </span>
          <span className="eyebrow">DEMO REQUEST SAVED</span>
          <h1 ref={confirmationRef} tabIndex={-1}>
            Thanks, {confirmation.name.split(' ')[0]}.
          </h1>
          <p>Your comfort request is saved on this device.</p>
          <dl>
            <div>
              <dt>Reference</dt>
              <dd>{confirmation.id}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>
                {
                  serviceOptions.find((service) => service.id === confirmation.service)
                    ?.title
                }
              </dd>
            </div>
            <div>
              <dt>Preferred date</dt>
              <dd>{displayDate(confirmation.date!)}</dd>
            </div>
            <div>
              <dt>Preferred window</dt>
              <dd>{confirmation.time} · Eastern</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                {confirmation.name}
                <br />
                {confirmation.phone}
              </dd>
            </div>
          </dl>
          <Alert severity="info">
            This is a demo confirmation. No appointment has been scheduled and no one will
            call. In a live site, the team would confirm availability with you.
          </Alert>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="contained" component={Link} to="/">
              Back to home
            </Button>
            <Button
              onClick={() => {
                returnToForm.current = true;
                setConfirmation(null);
                setConsent(false);
                setFields({ name: '', phone: '', service: '', date: '', time: '' });
              }}
            >
              Try another request
            </Button>
          </div>
        </div>
      </section>
    );

  return (
    <>
      <section className="page-intro booking-intro">
        <div className="shell">
          <span className="eyebrow">A MORE COMFORTABLE HOME STARTS HERE</span>
          <h1>Let’s get you taken care of.</h1>
          <p>
            Tell us what you need and when works for you. Try the booking experience with
            sample details—your request stays in this browser.
          </p>
        </div>
      </section>
      <section className="shell booking-layout section-pad">
        <div className="booking-form-card">
          <div className="form-heading">
            <span className="service-icon">
              <CalendarDays size={25} />
            </span>
            <div>
              <h2>Request a visit</h2>
              <p>A few details, and you’re on your way.</p>
            </div>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="form-grid">
              <TextField
                id="booking-name"
                label="Your name"
                autoComplete="name"
                required
                value={fields.name}
                onChange={(e) => update('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
              <TextField
                id="booking-phone"
                label="Phone number"
                type="tel"
                autoComplete="tel"
                required
                value={fields.phone}
                onChange={(e) => update('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone || 'US number, including area code'}
                slotProps={{ htmlInput: { maxLength: 25 } }}
              />
              <TextField
                className="form-full"
                id="booking-service"
                label="What can we help with?"
                select
                required
                value={fields.service}
                onChange={(e) => update('service', e.target.value)}
                error={!!errors.service}
                helperText={errors.service}
              >
                {serviceOptions.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="booking-date"
                label="Preferred date"
                type="date"
                required
                value={fields.date}
                onChange={(e) => update('date', e.target.value)}
                error={!!errors.date}
                helperText={errors.date}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: clevelandToday() },
                }}
              />
              <TextField
                id="booking-time"
                label="Preferred time"
                select
                required
                value={fields.time}
                onChange={(e) => update('time', e.target.value)}
                error={!!errors.time}
                helperText={errors.time || 'Eastern time · preference only'}
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="form-consent">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                  />
                }
                label="I understand this demo saves my details on this device only and does not schedule a real visit."
              />
            </div>
            {saveError && (
              <Alert severity="error" className="mb-4">
                {saveError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              endIcon={<ArrowRight size={18} />}
            >
              Save my demo request
            </Button>
            <p className="form-footnote">
              Preferred times aren’t reserved appointments. Please use sample personal
              details for this demo.
            </p>
          </form>
        </div>
        <aside className="booking-aside">
          <div className="booking-help">
            <Phone size={26} />
            <h2>Need help sooner?</h2>
            <p>
              For an urgent heating or cooling issue, our emergency line is available
              24/7.
            </p>
            <a href={business.phoneHref}>{business.phone}</a>
            <small>Fictional demo number · no live dispatch</small>
          </div>
          <div className="booking-details">
            <h3>What happens next?</h3>
            <p>
              <Check size={18} /> Your demo request is saved locally.
            </p>
            <p>
              <Check size={18} /> You’ll get a confirmation on screen.
            </p>
            <p>
              <ShieldCheck size={18} /> Nothing is sent to a real service team.
            </p>
            <div>
              <Clock3 size={18} />
              <strong>Regular service hours</strong>
            </div>
            {business.hours.map((hours) => (
              <span key={hours}>{hours}</span>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
