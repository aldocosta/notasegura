import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request } from 'express';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    (req as any).__logError = exception;
    throw exception;
  }
}
