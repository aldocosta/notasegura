import { RateLimitStore } from './rate-limit.store';
import { RateLimitDocument } from './rate-limit.schema';
import { Model } from 'mongoose';
import {
  RATE_LIMIT_CREATE_MAX,
  RATE_LIMIT_WINDOW_SECONDS,
} from './rate-limit.constants';

type MockModel = {
  findOne: jest.Mock;
  findOneAndUpdate: jest.Mock;
  create: jest.Mock;
};

describe('RateLimitStore', () => {
  it('allows requests under the limit and increments count', async () => {
    const model: MockModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      create: jest.fn(),
    };
    const store = new RateLimitStore(
      model as unknown as Model<RateLimitDocument>,
    );
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    model.create.mockResolvedValue({ count: 1 });

    const result = await store.checkAndIncrement('1.2.3.4', 'POST:/api/notes');
    expect(result.allowed).toBe(true);
    expect(model.create).toHaveBeenCalled();
  });

  it('returns retryAfter when limit exceeded', async () => {
    const model: MockModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      create: jest.fn(),
    };
    const store = new RateLimitStore(
      model as unknown as Model<RateLimitDocument>,
    );
    const now = new Date();
    const windowStart = new Date(Math.floor(now.getTime() / 60000) * 60000);
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: 'id',
        count: 10,
        windowStart,
      }),
    });

    const result = await store.checkAndIncrement('1.2.3.4', 'POST:/api/notes');
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('keeps the create limit at 10 requests per 60 seconds', () => {
    expect(RATE_LIMIT_CREATE_MAX).toBe(10);
    expect(RATE_LIMIT_WINDOW_SECONDS).toBe(60);
  });
});
