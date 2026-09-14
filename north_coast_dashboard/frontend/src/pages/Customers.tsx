import { useState } from 'react';
import { Drawer, IconButton, InputAdornment, TextField } from '@mui/material';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  Search,
  X,
} from 'lucide-react';
import type { Customer, Job } from '../lib/types';
import { formatMoney } from '../lib/dates';
import { CompactJob, EmptyState } from '../components/Shared';

export default function Customers({
  customers,
  jobs,
  onOpen,
}: {
  customers: Customer[];
  jobs: Job[];
  onOpen: (job: Job) => void;
}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const filtered = customers
    .filter((customer) =>
      `${customer.name} ${customer.suburb} ${customer.phone} ${customer.email}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  const history = selected
    ? jobs
        .filter((job) => job.customer.id === selected.id)
        .sort((a, b) =>
          `${b.scheduledDate}${b.scheduledTime}`.localeCompare(
            `${a.scheduledDate}${a.scheduledTime}`,
          ),
        )
    : [];
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">GOOD SERVICE STARTS WITH KNOWING PEOPLE</span>
          <h1>Your Cleveland neighbors.</h1>
          <p>
            A familiar face behind every service call. Find their details and job history
            here.
          </p>
        </div>
        <span className="page-total">
          <strong>{customers.length}</strong> customers
        </span>
      </div>
      <div className="customer-search-row">
        <TextField
          label="Search customers"
          placeholder="Name, suburb, phone, or email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            },
          }}
        />
        <span>
          {filtered.length} {filtered.length === 1 ? 'customer' : 'customers'}
          {query ? ' found' : ' in your community'}
        </span>
      </div>
      {filtered.length ? (
        <div className="customer-grid">
          {filtered.map((customer) => {
            const related = jobs.filter((job) => job.customer.id === customer.id);
            return (
              <button
                className="customer-card surface"
                key={customer.id}
                onClick={() => setSelected(customer)}
              >
                <div className="customer-card-top">
                  <span className="customer-avatar">
                    {customer.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <ArrowUpRight size={17} />
                </div>
                <h2>{customer.name}</h2>
                <span className="customer-suburb">
                  <MapPin size={14} />
                  {customer.suburb}, OH
                </span>
                <div className="customer-contact">
                  <span>
                    <Phone size={14} />
                    {customer.phone}
                  </span>
                  <span>
                    <Mail size={14} />
                    {customer.email}
                  </span>
                </div>
                <div className="customer-card-bottom">
                  <span>
                    <BriefcaseBusiness size={14} />
                    {related.length} {related.length === 1 ? 'job' : 'jobs'}
                  </span>
                  <span>
                    View history <ArrowUpRight size={14} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="surface">
          <EmptyState
            title="No neighbors found"
            description="Try a different name, suburb, phone number, or email address."
          />
        </div>
      )}
      <p className="page-footnote">
        Sample customer records for this fictional company. Contact details are for
        demonstration only.
      </p>
      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <section
            className="customer-history-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-profile-title"
          >
            <div className="drawer-top">
              <span className="eyebrow">CUSTOMER PROFILE</span>
              <IconButton
                aria-label="Close customer history"
                onClick={() => setSelected(null)}
              >
                <X size={21} />
              </IconButton>
            </div>
            <div className="customer-profile">
              <span className="customer-avatar">
                {selected.name
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <h2 id="customer-profile-title">{selected.name}</h2>
              <span>
                <MapPin size={15} />
                {selected.address}, {selected.suburb}, OH
              </span>
              <div>
                <span>
                  <Phone size={15} />
                  {selected.phone}
                </span>
                <span>
                  <Mail size={15} />
                  {selected.email}
                </span>
              </div>
            </div>
            <div className="customer-history-stats">
              <div>
                <strong>{history.length}</strong>
                <span>Total jobs</span>
              </div>
              <div>
                <strong>
                  {formatMoney(
                    history
                      .filter((job) => job.status === 'completed')
                      .reduce((sum, job) => sum + job.amount, 0),
                  )}
                </strong>
                <span>Completed work</span>
              </div>
            </div>
            <h3 className="history-heading">Job history</h3>
            {history.length ? (
              <div className="customer-history-list">
                {history.map((job) => (
                  <CompactJob
                    key={job.id}
                    job={job}
                    showDate
                    onOpen={(item) => {
                      setSelected(null);
                      onOpen(item);
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No job history yet"
                description="Create a job for this customer to start their service history."
              />
            )}
          </section>
        )}
      </Drawer>
    </div>
  );
}
