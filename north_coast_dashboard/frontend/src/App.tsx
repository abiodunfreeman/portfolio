import { lazy, Suspense, useState } from 'react';
import { Alert, Button, LinearProgress, Skeleton, Snackbar } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import WorkspaceLayout from './components/WorkspaceLayout';
import Overview from './pages/Overview';
import { useDashboard } from './hooks/useDashboard';
import type { JobInput } from './lib/types';

const Jobs = lazy(() => import('./pages/Jobs'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Customers = lazy(() => import('./pages/Customers'));
const NewJobDialog = lazy(() => import('./components/NewJobDialog'));
const JobDrawer = lazy(() => import('./components/JobDrawer'));

export default function App() {
  const { data, loading, error, refresh, save } = useDashboard();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newJob, setNewJob] = useState(false);
  const [notice, setNotice] = useState('');
  const selected = data?.jobs.find((job) => job.id === selectedId);
  function closeJob() {
    setSelectedId(null);
    requestAnimationFrame(() => {
      // A status filter can remove the original row; customer history also unmounts.
      if (
        !document.activeElement ||
        document.activeElement === document.body ||
        !document.activeElement.isConnected
      )
        document.getElementById('main')?.focus({ preventScroll: true });
    });
  }
  async function saveJob(input: JobInput, id?: number) {
    const job = await save(input, id);
    setNotice(
      `${job.reference} ${id === undefined ? 'created' : 'updated'} successfully.`,
    );
    if (id === undefined) setSelectedId(job.id);
  }
  return (
    <WorkspaceLayout loading={loading} refresh={() => void refresh()}>
      {loading && (
        <LinearProgress
          className="workspace-loading"
          aria-label="Loading workspace data"
        />
      )}
      {error && (
        <div className="workspace-error">
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void refresh()}
                disabled={loading}
              >
                Retry
              </Button>
            }
          >
            {error}
            {data && ' Showing the last loaded data until refresh succeeds.'}
          </Alert>
        </div>
      )}
      {!data ? (
        <div className="page-content">
          {loading ? (
            <>
              <Skeleton height={72} width="65%" />
              <Skeleton height={30} width="40%" />
              <div className="kpi-grid mt-7">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} variant="rounded" height={155} />
                ))}
              </div>
              <Skeleton variant="rounded" height={380} className="mt-6" />
            </>
          ) : (
            <div className="surface initial-error">
              <h1>Let’s reconnect your workspace.</h1>
              <p>
                Check that the API is running, then try again. A free hosting service may
                need a minute to wake up.
              </p>
              <Button variant="contained" onClick={() => void refresh()}>
                Try again
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="page-content">
              <Skeleton height={90} />
              <Skeleton variant="rounded" height={450} />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <Overview
                  jobs={data.jobs}
                  technicians={data.technicians}
                  summary={data.summary}
                  onOpen={(job) => setSelectedId(job.id)}
                  onNew={() => setNewJob(true)}
                />
              }
            />
            <Route
              path="/jobs"
              element={
                <Jobs
                  jobs={data.jobs}
                  technicians={data.technicians}
                  onOpen={(job) => setSelectedId(job.id)}
                  onNew={() => setNewJob(true)}
                />
              }
            />
            <Route
              path="/schedule"
              element={
                <Schedule
                  jobs={data.jobs}
                  technicians={data.technicians}
                  onOpen={(job) => setSelectedId(job.id)}
                  onNew={() => setNewJob(true)}
                />
              }
            />
            <Route
              path="/customers"
              element={
                <Customers
                  jobs={data.jobs}
                  customers={data.customers}
                  onOpen={(job) => setSelectedId(job.id)}
                />
              }
            />
            <Route
              path="*"
              element={
                <section className="page-content">
                  <div className="surface initial-error">
                    <h1>This page is off the schedule.</h1>
                    <p>Head back to your workspace overview.</p>
                    <Button component={Link} to="/" variant="contained">
                      Back to overview
                    </Button>
                  </div>
                </section>
              }
            />
          </Routes>
        </Suspense>
      )}
      {selected && (
        <Suspense fallback={<LinearProgress aria-label="Opening job details" />}>
          <JobDrawer
            key={selected.id}
            job={selected}
            onClose={closeJob}
            onSave={saveJob}
          />
        </Suspense>
      )}
      {newJob && data && (
        <Suspense fallback={<LinearProgress aria-label="Opening new job form" />}>
          <NewJobDialog
            customers={data.customers}
            technicians={data.technicians}
            onClose={() => setNewJob(false)}
            onSave={saveJob}
          />
        </Suspense>
      )}
      <Snackbar
        open={!!notice}
        autoHideDuration={4500}
        onClose={() => setNotice('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setNotice('')}>
          {notice}
        </Alert>
      </Snackbar>
    </WorkspaceLayout>
  );
}
