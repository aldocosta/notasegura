import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UnhandledErrorFilter } from './unhandled-error.filter';

@Module({
  providers: [{ provide: APP_FILTER, useClass: UnhandledErrorFilter }],
})
export class ErrorsModule {}
