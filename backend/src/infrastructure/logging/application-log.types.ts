export type LogKind = 'request' | 'error';

export interface ApplicationLogRecord {
  kind: LogKind;
  occurredAt: Date;
  method: string;
  route: string;
  status: number;
  durationMs?: number;
  message?: string;
  stack?: string;
}
