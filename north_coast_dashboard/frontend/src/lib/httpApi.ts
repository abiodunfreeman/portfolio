import type {
  DashboardApi,
  DashboardSummary,
  Customer,
  Job,
  JobInput,
  Technician,
} from './types';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function normalizeApiUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '');
  const parsed = new URL(trimmed);
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.search || parsed.hash) {
    throw new Error(
      'VITE_API_URL must be an HTTP or HTTPS API address without a query or fragment.',
    );
  }
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

function serverErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return;
  const response = body as { message?: unknown; errors?: unknown };
  const details =
    response.errors && typeof response.errors === 'object'
      ? Object.values(response.errors)
          .filter((value): value is string => typeof value === 'string')
          .slice(0, 3)
      : [];
  return (
    [typeof response.message === 'string' ? response.message : '', ...details]
      .filter(Boolean)
      .join(' ') || undefined
  );
}

/** Configured API failures stay visible; a failed server request never writes to demo storage. */
export function createHttpApi(
  baseUrl: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 12_000,
): DashboardApi {
  async function request<T>(path: string, method = 'GET', body?: JobInput): Promise<T> {
    let apiUrl: string;
    try {
      apiUrl = normalizeApiUrl(baseUrl);
    } catch {
      throw new ApiError(
        'The API address is invalid. Set VITE_API_URL to your backend URL and rebuild the frontend.',
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(`${apiUrl}${path}`, {
        method,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        if (response.ok)
          throw new ApiError(
            'The API returned an unreadable response. Check the backend URL and try again.',
          );
      }
      if (!response.ok) {
        throw new ApiError(
          serverErrorMessage(payload) ??
            `The API returned an error (${response.status}). Please try again.`,
        );
      }
      return payload as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (controller.signal.aborted) {
        throw new ApiError(
          'The API is taking longer than expected. A free hosting service may be waking up; wait a moment and retry.',
        );
      }
      throw new ApiError(
        'The API could not be reached. Check that the backend is running and allows this frontend address, then retry.',
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    getJobs: () => request<Job[]>('/jobs'),
    getCustomers: () => request<Customer[]>('/customers'),
    getTechnicians: () => request<Technician[]>('/technicians'),
    getSummary: () => request<DashboardSummary>('/dashboard/summary'),
    createJob: (input) => request<Job>('/jobs', 'POST', input),
    updateJob: (id, input) =>
      request<Job>(`/jobs/${encodeURIComponent(String(id))}`, 'PUT', input),
  };
}
