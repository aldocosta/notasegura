import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationLogSchema } from '../../infrastructure/logging/application-log.schema';
import { LogStore } from '../../infrastructure/logging/log-store';
import { RequestCompletionInterceptor } from './request-completion.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ApplicationLog', schema: ApplicationLogSchema },
    ]),
  ],
  providers: [LogStore, RequestCompletionInterceptor],
  exports: [LogStore, RequestCompletionInterceptor],
})
export class LoggingModule {}
