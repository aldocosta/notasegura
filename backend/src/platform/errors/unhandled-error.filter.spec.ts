import { ArgumentsHost, BadRequestException, HttpServer } from '@nestjs/common';
import { UnhandledErrorFilter } from './unhandled-error.filter';

describe('UnhandledErrorFilter', () => {
  const bodies: unknown[] = [];
  const reply = jest.fn((_response: unknown, body: unknown) => {
    bodies.push(body);
  });
  const response = {};
  const adapter = {
    reply,
    isHeadersSent: () => false,
    end: jest.fn(),
  } as unknown as HttpServer;
  const host = {
    getArgByIndex: (index: number) => (index === 1 ? response : {}),
  } as unknown as ArgumentsHost;

  beforeEach(() => {
    reply.mockClear();
    bodies.length = 0;
  });

  it('passes an HttpException through unchanged', () => {
    const exception = new BadRequestException('nope');
    const filter = new UnhandledErrorFilter(adapter);
    filter.catch(exception, host);
    expect(reply).toHaveBeenCalledWith(response, exception.getResponse(), 400);
  });

  it('maps an unexpected error to 500 without internals', () => {
    const error = new Error('database password leaked');
    error.stack = 'Error: database password leaked\n    at secret.ts:1:1';
    const filter = new UnhandledErrorFilter(adapter);
    filter.catch(error, host);
    const body = bodies[0];
    expect(reply).toHaveBeenCalledWith(
      response,
      { statusCode: 500, message: 'Internal server error' },
      500,
    );
    expect(body).toEqual({
      statusCode: 500,
      message: 'Internal server error',
    });
    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain('database password leaked');
    expect(serialized).not.toContain(error.stack);
  });
});
