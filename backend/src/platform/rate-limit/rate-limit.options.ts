import {
  RATE_LIMIT_CREATE_MAX,
  RATE_LIMIT_WINDOW_SECONDS,
} from './rate-limit.constants';

export const RATE_LIMIT_OPTIONS = Symbol('RATE_LIMIT_OPTIONS');

export interface RateLimitOptions {
  createMax: number;
  windowSeconds: number;
}

const POSITIVE_INTEGER = /^[1-9]\d*$/;

function readPositiveInteger(
  get: (key: string) => string | undefined,
  name: string,
  fallback: number,
): number {
  const raw = get(name);
  if (raw === undefined || raw === '') return fallback;
  if (!POSITIVE_INTEGER.test(raw)) {
    throw new Error(`${name} must be a positive integer`);
  }
  return Number(raw);
}

export function parseRateLimitOptions(
  get: (key: string) => string | undefined,
): RateLimitOptions {
  return {
    createMax: readPositiveInteger(
      get,
      'RATE_LIMIT_CREATE_MAX',
      RATE_LIMIT_CREATE_MAX,
    ),
    windowSeconds: readPositiveInteger(
      get,
      'RATE_LIMIT_WINDOW_SECONDS',
      RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}
