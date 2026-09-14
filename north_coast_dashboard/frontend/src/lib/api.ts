import { createDemoApi } from './demo';
import { createHttpApi } from './httpApi';
import type { DashboardApi } from './types';

const configuredUrl = (import.meta.env.VITE_API_URL ?? '').trim();

/** An unset URL intentionally runs the standalone, local-only demo. */
export const demoMode = configuredUrl.length === 0;

export const api: DashboardApi = demoMode
  ? createDemoApi({
      // Keep browser storage access inside the guarded demo read/write methods.
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value),
    })
  : createHttpApi(configuredUrl);
