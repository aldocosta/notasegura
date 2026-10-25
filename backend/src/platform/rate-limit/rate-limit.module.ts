import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import {
  RateLimitDocument,
  RateLimitSchema,
} from './rate-limit.schema';
import { RateLimitStore } from './rate-limit.store';
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
