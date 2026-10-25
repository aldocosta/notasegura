import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RateLimitDocument } from './rate-limit.schema';
import {
  RATE_LIMIT_CREATE_MAX,
  RATE_LIMIT_WINDOW_SECONDS,
} from './rate-limit.constants';
import { RateLimitCheckResult } from './rate-limit.types';

@Injectable()
export class RateLimitStore {
  private readonly logger = new Logger(RateLimitStore.name);

  constructor(
    @InjectModel(RateLimitDocument.name)
    private readonly model: Model<RateLimitDocument>,
  ) {}

  async checkAndIncrement(
    ip: string,
    endpoint: string,
  ): Promise<RateLimitCheckResult> {
    const now = new Date();
    const windowStart = new Date(
      Math.floor(now.getTime() / (RATE_LIMIT_WINDOW_SECONDS * 1000)) *
        (RATE_LIMIT_WINDOW_SECONDS * 1000),
    );
    const expiresAt = new Date(
      windowStart.getTime() + RATE_LIMIT_WINDOW_SECONDS * 1000,
    );

    const max = RATE_LIMIT_CREATE_MAX;

    // Try to find existing window
    const existing = await this.model
      .findOne({ ip, endpoint, windowStart })
      .exec();

    if (existing) {
      if (existing.count >= max) {
        const retryAfter = Math.max(
          1,
          Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
        );
        this.logger.debug(
          `Rate limit exceeded for ${ip} on ${endpoint}: ${existing.count}/${max}`,
        );
        return { allowed: false, retryAfter };
      }

      const updated = await this.model
        .findOneAndUpdate(
          { _id: existing._id, count: existing.count },
          { $inc: { count: 1 } },
          { new: true },
        )
        .exec();

      if (!updated) {
        // Retry with fresh window
        return this.checkAndIncrement(ip, endpoint);
      }

      return { allowed: true, retryAfter: retryAfterFor(expiresAt, now) };
    }

    // Create new window
    try {
      await this.model.create({
        ip,
        endpoint,
        windowStart,
        count: 1,
        expiresAt,
      });
      return { allowed: true, retryAfter: retryAfterFor(expiresAt, now) };
    } catch (err) {
      // If duplicate (race condition), retry
      if ((err as { code?: number }).code === 11000) {
        return this.checkAndIncrement(ip, endpoint);
      }
      throw err;
    }
  }

}

function retryAfterFor(expiresAt: Date, now: Date): number {
  return Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));
}
