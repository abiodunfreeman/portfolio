import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import type { Customer, DashboardSummary, Job, JobInput, Technician } from '../lib/types';

type Data = {
  jobs: Job[];
  customers: Customer[];
  technicians: Technician[];
  summary: DashboardSummary;
};

export function useDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const revision = useRef(0);

  const load = useCallback(() => {
    const request = ++revision.current;
    return Promise.all([
      api.getJobs(),
      api.getCustomers(),
      api.getTechnicians(),
      api.getSummary(),
    ])
      .then(([jobs, customers, technicians, summary]) => {
        if (revision.current === request) {
          setData({ jobs, customers, technicians, summary });
          setError('');
        }
      })
      .catch((cause: unknown) => {
        if (revision.current === request)
          setError(
            cause instanceof Error
              ? cause.message
              : 'Unable to load the workspace. Please retry.',
          );
      })
      .finally(() => {
        if (revision.current === request) setLoading(false);
      });
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    return load();
  }, [load]);

  useEffect(() => {
    void load();
    return () => {
      revision.current += 1;
    };
  }, [load]);

  async function save(input: JobInput, id?: number) {
    const job =
      id === undefined ? await api.createJob(input) : await api.updateJob(id, input);
    // Display only an accepted write. A failed refresh retains the confirmed job and exposes an error.
    setData((previous) =>
      previous
        ? {
            ...previous,
            jobs:
              id === undefined
                ? [...previous.jobs, job]
                : previous.jobs.map((item) => (item.id === id ? job : item)),
          }
        : previous,
    );
    await refresh();
    return job;
  }

  return { data, loading, error, refresh, save };
}
