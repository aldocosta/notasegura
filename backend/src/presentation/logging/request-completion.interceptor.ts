import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { LogStore } from '../../infrastructure/logging/log-store';
import { routeTemplate } from '../../infrastructure/logging/route-template';
import { ApplicationLogRecord } from '../../infrastructure/logging/application-log.types';

@Injectable()
export class RequestCompletionInterceptor implements NestInterceptor {
  constructor(private readonly store: LogStore) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const start = Date.now();
    const route = routeTemplate(req);
    const method = req?.method ?? '';

    const secrets = [req?.params?.id, req?.query?.passphrase, req?.body?.text].filter(Boolean);

    const writeRequest = async (status: number, error?: { message?: string; stack?: string }) => {
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
      mergeMap(async (data) => {
        await writeRequest(res?.statusCode ?? 200);
        return data;
      }),
      catchError(async (err) => {
        const status = err?.status ?? err?.statusCode ?? 500;
        const message = err?.message ?? 'Internal server error';
        const stack = err?.stack;
        await writeRequest(status, { message, stack });
        throw err;
      }),
    ) as any;
  }
}
