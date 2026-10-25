export interface RateLimitRecord {
  ip: string;
  endpoint: string;
  windowStart: Date;
  count: number;
  expiresAt: Date;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  retryAfter: number;
}
