import mongoose from 'mongoose';
import { APPLICATION_LOG_TTL_SECONDS } from './logging.constants';

const applicationLogSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true },
    occurredAt: { type: Date, required: true },
    method: { type: String, required: true },
    route: { type: String, required: true },
    status: { type: Number, required: true },
    durationMs: { type: Number },
    message: { type: String },
    stack: { type: String },
  },
  { collection: 'application_logs', timestamps: false },
);

applicationLogSchema.index(
  { occurredAt: 1 },
  { expireAfterSeconds: APPLICATION_LOG_TTL_SECONDS },
);

export const ApplicationLogSchema = applicationLogSchema;
export type ApplicationLogDocument = mongoose.Document & {
  kind: string;
  occurredAt: Date;
  method: string;
  route: string;
  status: number;
  durationMs?: number;
  message?: string;
  stack?: string;
};
