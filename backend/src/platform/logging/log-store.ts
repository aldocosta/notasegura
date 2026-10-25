import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ApplicationLogDocument } from './application-log.schema';
import { ApplicationLogRecord } from './application-log.types';
import { redactValue } from './redact';

@Injectable()
export class LogStore {
  constructor(
    @InjectModel('ApplicationLog')
    private readonly model: Model<ApplicationLogDocument>,
  ) {}

  async append(
    record: ApplicationLogRecord,
    secrets: string[] = [],
  ): Promise<void> {
    try {
      const sanitized = redactValue(
        { ...record },
        secrets,
      ) as ApplicationLogRecord;
      await this.model.create(sanitized);
    } catch (err: unknown) {
      const error = err as Error | undefined;
      process.stderr.write(
        `Log store failure: ${error?.stack ?? String(err)}\n`,
      );
    }
  }
}
