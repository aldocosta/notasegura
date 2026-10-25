import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApplicationLogSchema } from './application-log.schema';
import { LogStore } from './log-store';
import { RequestCompletionInterceptor } from './request-completion.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ApplicationLog', schema: ApplicationLogSchema },
    ]),
  ],
  providers: [
    LogStore,
    RequestCompletionInterceptor,
    { provide: APP_INTERCEPTOR, useClass: RequestCompletionInterceptor },
  ],
  exports: [LogStore, RequestCompletionInterceptor],
})
export class LoggingModule {}
