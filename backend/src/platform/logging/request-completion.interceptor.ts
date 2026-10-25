import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LogStore } from './log-store';
import { routeTemplate } from './route-template';
import { ApplicationLogRecord } from './application-log.types';

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

@Injectable()
export class RequestCompletionInterceptor implements NestInterceptor {
  constructor(private readonly store: LogStore) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const start = Date.now();
    const route = routeTemplate(req);
    const method = req.method ?? '';

    const reqAny = req as unknown as {
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      body?: Record<string, unknown>;
    };

    const secrets = [
      typeof reqAny.params?.id === 'string' ? reqAny.params.id : undefined,
      typeof reqAny.query?.passphrase === 'string'
        ? reqAny.query.passphrase
        : undefined,
      typeof reqAny.body?.text === 'string' ? reqAny.body.text : undefined,
    ].filter((s): s is string => Boolean(s));

    const writeRequest = async (
      status: number,
      error?: { message?: string; stack?: string },
    ) => {
      const occurredAt = new Date();
      const durationMs = Date.now() - start;
      const requestRecord: ApplicationLogRecord = {
        kind: 'request',
        occurredAt,
        method,
        route,
        status,
        durationMs,
      };
      await this.store.append(requestRecord, secrets);
      if (status >= 400) {
        const errorRecord: ApplicationLogRecord = {
          kind: 'error',
          occurredAt,
          method,
          route,
          status,
          message: error?.message,
          stack: status >= 500 ? error?.stack : undefined,
        };
        await this.store.append(errorRecord, secrets);
      }
    };

    return next.handle().pipe(
      mergeMap(async (data: unknown) => {
        await writeRequest(res.statusCode ?? 200);
        return data;
      }),
      catchError(async (err: unknown) => {
        const httpErr = err as HttpError;
        const status = httpErr?.status ?? httpErr?.statusCode ?? 500;
        const message = httpErr?.message ?? 'Internal server error';
        const stack = httpErr?.stack;
        await writeRequest(status, { message, stack });
        throw err;
      }),
    );
  }
}
