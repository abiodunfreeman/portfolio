import { useState } from 'react';
import {
  Button,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Filter, Plus, Search, X } from 'lucide-react';
import type { Job, Technician } from '../lib/types';
import { statuses } from '../config';
import { formatDate, formatMoney } from '../lib/dates';
import { EmptyState, StatusBadge, TechAvatar, TimeLabel } from '../components/Shared';

export default function Jobs({
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
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const status = statuses.some((item) => item.value === params.get('status'))
    ? params.get('status')!
    : '';
  const technician = technicians.some(
    (item) => String(item.id) === params.get('technician'),
  )
    ? params.get('technician')!
    : '';
  const date = params.get('date') || '';
  const filtered = jobs
    .filter(
      (job) =>
        (!status || job.status === status) &&
        (!technician || String(job.technician.id) === technician) &&
        (!date || job.scheduledDate === date) &&
        `${job.reference} ${job.title} ${job.customer.name} ${job.customer.suburb}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      `${a.scheduledDate}${a.scheduledTime}`.localeCompare(
        `${b.scheduledDate}${b.scheduledTime}`,
      ),
    );
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(filtered.length / rowsPerPage) - 1),
  );
  const visible = filtered.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage,
  );
  const hasFilters = !!(status || technician || date || query);
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
    setPage(0);
  }
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FROM FIRST CALL TO FINISHED JOB</span>
          <h1>Every job. One clear picture.</h1>
          <p>Keep work moving, customers comfortable, and your team in sync.</p>
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
      <section className="surface jobs-surface">
        <div className="card-heading">
          <div className="heading-inline">
            <h2>All jobs</h2>
            <span className="count-pill">{jobs.length}</span>
          </div>
          <span className="muted text-xs">All times Eastern</span>
        </div>
        <div className="job-filters">
          <TextField
            className="job-search"
            label="Search jobs"
            placeholder="Name, job, or suburb"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) => filter('status', event.target.value)}
          >
            <MenuItem value="">All statuses</MenuItem>
            {statuses.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Technician"
            value={technician}
            onChange={(event) => filter('technician', event.target.value)}
          >
            <MenuItem value="">All technicians</MenuItem>
            {technicians.map((item) => (
              <MenuItem key={item.id} value={String(item.id)}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            label="Scheduled date"
            value={date}
            onChange={(event) => filter('date', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </div>
        {hasFilters && (
          <div className="filter-summary">
            <span>
              <Filter size={13} />
              {filtered.length} matching {filtered.length === 1 ? 'job' : 'jobs'}
            </span>
            <Button
              size="small"
              startIcon={<X size={14} />}
              onClick={() => {
                setParams({});
                setQuery('');
                setPage(0);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
        {filtered.length ? (
          <>
            <TableContainer className="desktop-job-table">
              <Table aria-label="Jobs">
                <TableHead>
                  <TableRow>
                    <TableCell>JOB / CUSTOMER</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>SCHEDULE</TableCell>
                    <TableCell>TECHNICIAN</TableCell>
                    <TableCell align="right">AMOUNT</TableCell>
                    <TableCell>
                      <span className="sr-only">Details</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visible.map((job) => (
                    <TableRow
                      key={job.id}
                      hover
                      className="job-table-row"
                      onClick={() => onOpen(job)}
                    >
                      <TableCell>
                        <button
                          className="table-job-link"
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpen(job);
                          }}
                        >
                          <span className="job-reference">{job.reference}</span>
                          <strong>{job.title}</strong>
                          <span>
                            {job.customer.name} <b>·</b> {job.customer.suburb}
                          </span>
                        </button>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={job.status} />
                      </TableCell>
                      <TableCell>
                        <span className="table-date">
                          {formatDate(job.scheduledDate)}
                        </span>
                        <span className="table-time">
                          <TimeLabel time={job.scheduledTime} />
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="table-tech">
                          <TechAvatar technician={job.technician} small />
                          <span>{job.technician.name}</span>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <strong className="table-amount">
                          {formatMoney(job.amount)}
                        </strong>
                      </TableCell>
                      <TableCell>
                        <ArrowUpRight size={16} className="muted" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="mobile-job-list">
              {visible.map((job) => (
                <button
                  key={job.id}
                  className="mobile-job-card"
                  onClick={() => onOpen(job)}
                >
                  <div>
                    <span className="job-reference">{job.reference}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <h3>{job.title}</h3>
                  <p>
                    {job.customer.name} · {job.customer.suburb}
                  </p>
                  <div>
                    <span>
                      {formatDate(job.scheduledDate)} ·{' '}
                      <TimeLabel time={job.scheduledTime} />
                    </span>
                    <strong>{formatMoney(job.amount)}</strong>
                  </div>
                  <span className="mobile-job-tech">
                    <TechAvatar technician={job.technician} small />
                    {job.technician.name}
                    <ArrowUpRight size={15} />
                  </span>
                </button>
              ))}
            </div>
            <TablePagination
              component="div"
              count={filtered.length}
              page={currentPage}
              onPageChange={(_event, value) => setPage(value)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[8, 15, 30]}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
              }}
            />
          </>
        ) : (
          <EmptyState
            title="No jobs match those filters"
            description="Try another date or technician, or clear the filters to see all jobs."
          />
        )}
      </section>
      <p className="page-footnote">
        Job amounts are estimates until work is completed. Only completed jobs contribute
        to weekly revenue.
      </p>
    </div>
  );
}
