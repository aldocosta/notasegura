import { RateLimitStore } from './rate-limit.store';
import { RateLimitDocument } from './rate-limit.schema';
import { Model } from 'mongoose';
import {
  RATE_LIMIT_CREATE_MAX,
  RATE_LIMIT_WINDOW_SECONDS,
} from './rate-limit.constants';
import { RateLimitOptions } from './rate-limit.options';

type MockModel = {
  findOne: jest.Mock;
  findOneAndUpdate: jest.Mock;
  create: jest.Mock;
};

const DEFAULT_OPTIONS: RateLimitOptions = { createMax: 60, windowSeconds: 60 };

function createMockModel(): MockModel {
  return {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
  };
}

function createStore(
  model: MockModel,
  options: RateLimitOptions = DEFAULT_OPTIONS,
): RateLimitStore {
  return new RateLimitStore(
    model as unknown as Model<RateLimitDocument>,
    options,
  );
}

describe('RateLimitStore', () => {
  it('allows requests under the limit and increments count', async () => {
    const model = createMockModel();
    const store = createStore(model);
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    model.create.mockResolvedValue({ count: 1 });

    const result = await store.checkAndIncrement('1.2.3.4', 'POST:/api/notes');
    expect(result.allowed).toBe(true);
    expect(model.create).toHaveBeenCalled();
  });

  it('returns retryAfter when limit exceeded', async () => {
    const model = createMockModel();
    const store = createStore(model);
    const now = new Date();
    const windowStart = new Date(Math.floor(now.getTime() / 60000) * 60000);
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: 'id',
        count: 60,
        windowStart,
      }),
    });

    const result = await store.checkAndIncrement('1.2.3.4', 'POST:/api/notes');
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('keeps the create limit at 60 requests per 60 seconds', () => {
    expect(RATE_LIMIT_CREATE_MAX).toBe(60);
    expect(RATE_LIMIT_WINDOW_SECONDS).toBe(60);
  });

  it('denies the request after the configured maximum', async () => {
    const model = createMockModel();
    const store = createStore(model, { createMax: 2, windowSeconds: 60 });
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: 'id', count: 2 }),
    });

    const result = await store.checkAndIncrement('1.2.3.4', 'POST:/api/notes');
    expect(result.allowed).toBe(false);
  });

  it('computes Retry-After from the configured window', async () => {
    const model = createMockModel();
    const store = createStore(model, { createMax: 1, windowSeconds: 120 });
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: 'id', count: 1 }),
    });

    const result = await store.checkAndIncrement('1.2.3.4', 'POST:/api/notes');
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThanOrEqual(1);
    expect(result.retryAfter).toBeLessThanOrEqual(120);
  });
});
