import { RateLimitGuard } from './rate-limit.guard';
import { ExecutionContext, HttpException } from '@nestjs/common';
import { RateLimitStore } from './rate-limit.store';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let store: jest.Mocked<Pick<RateLimitStore, 'checkAndIncrement'>>;

  beforeEach(() => {
    store = {
      checkAndIncrement: jest.fn(),
    };
    guard = new RateLimitGuard(store as unknown as RateLimitStore);
  });

  it('exempts /api/health from rate limiting', async () => {
    const context = createMockContext('GET', '/api/health');
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(store.checkAndIncrement).not.toHaveBeenCalled();
  });

  it('allows POST /api/notes when under limit', async () => {
    store.checkAndIncrement.mockResolvedValue({
      allowed: true,
      retryAfter: 60,
    });
    const context = createMockContext('POST', '/api/notes');
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('throws 429 with Retry-After when exceeded', async () => {
    store.checkAndIncrement.mockResolvedValue({
      allowed: false,
      retryAfter: 45,
    });
    const context = createMockContext('POST', '/api/notes');
    const response: unknown = context.switchToHttp().getResponse();
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      HttpException,
    );
    expect(
      (response as { setHeader: jest.Mock }).setHeader,
    ).toHaveBeenCalledWith('Retry-After', '45');
  });
});

function createMockContext(method: string, url: string): ExecutionContext {
  const response = {
    setHeader: jest.fn(),
  };
  const request = {
    method,
    url,
    originalUrl: url,
    path: url,
    ip: '127.0.0.1',
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
  };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ExecutionContext;
}
