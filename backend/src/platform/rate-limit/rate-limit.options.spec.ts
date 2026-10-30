import { parseRateLimitOptions } from './rate-limit.options';

function envOf(values: Record<string, string>) {
  return (key: string): string | undefined => values[key];
}

describe('parseRateLimitOptions', () => {
  it('uses 60 and 60 when the variables are unset', () => {
    expect(parseRateLimitOptions(() => undefined)).toEqual({
      createMax: 60,
      windowSeconds: 60,
    });
  });

  it('uses the defaults for empty values', () => {
    const get = envOf({
      RATE_LIMIT_CREATE_MAX: '',
      RATE_LIMIT_WINDOW_SECONDS: '',
    });
    expect(parseRateLimitOptions(get)).toEqual({
      createMax: 60,
      windowSeconds: 60,
    });
  });

  it('reads positive integers', () => {
    const get = envOf({
      RATE_LIMIT_CREATE_MAX: '20',
      RATE_LIMIT_WINDOW_SECONDS: '120',
    });
    expect(parseRateLimitOptions(get)).toEqual({
      createMax: 20,
      windowSeconds: 120,
    });
  });

  it.each(['0', '-1', '1.5', 'abc', '10abc'])(
    'rejects RATE_LIMIT_CREATE_MAX=%p',
    (value) => {
      const get = envOf({ RATE_LIMIT_CREATE_MAX: value });
      expect(() => parseRateLimitOptions(get)).toThrow(/RATE_LIMIT_CREATE_MAX/);
    },
  );

  it.each(['0', '-5', 'x'])('rejects RATE_LIMIT_WINDOW_SECONDS=%p', (value) => {
    const get = envOf({ RATE_LIMIT_WINDOW_SECONDS: value });
    expect(() => parseRateLimitOptions(get)).toThrow(
      /RATE_LIMIT_WINDOW_SECONDS/,
    );
  });
});
