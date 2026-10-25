import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class UnhandledErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(UnhandledErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException) {
      super.catch(exception, host);
      return;
    }
    this.logger.error(exception);
    const applicationRef =
      this.applicationRef ?? this.httpAdapterHost?.httpAdapter;
    if (!applicationRef) {
      throw exception;
    }
    const response: unknown = host.getArgByIndex(1);
    const body = {
      statusCode: 500,
      message: 'Internal server error',
    };
    if (!applicationRef.isHeadersSent(response)) {
      applicationRef.reply(response, body, 500);
    } else {
      applicationRef.end(response);
    }
  }
}
