import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithLogError extends Request {
  __logError?: unknown;
}

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<RequestWithLogError>();
    req.__logError = exception;
    throw exception;
  }
}
