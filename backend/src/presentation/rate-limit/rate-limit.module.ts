import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import {
  RateLimitDocument,
  RateLimitSchema,
} from '../../infrastructure/rate-limit/rate-limit.schema';
import { RateLimitStore } from '../../application/rate-limit/rate-limit.store';
import { RateLimitGuard } from './rate-limit.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RateLimitDocument.name, schema: RateLimitSchema },
    ]),
  ],
  providers: [
    RateLimitStore,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
  exports: [RateLimitStore],
})
export class RateLimitModule {}
