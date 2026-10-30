import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RateLimitDocument, RateLimitSchema } from './rate-limit.schema';
import { RateLimitStore } from './rate-limit.store';
import { RateLimitGuard } from './rate-limit.guard';
import {
  RATE_LIMIT_OPTIONS,
  parseRateLimitOptions,
} from './rate-limit.options';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RateLimitDocument.name, schema: RateLimitSchema },
    ]),
  ],
  providers: [
    {
      provide: RATE_LIMIT_OPTIONS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        parseRateLimitOptions((key) => config.get<string>(key)),
    },
    RateLimitStore,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
  exports: [RateLimitStore],
})
export class RateLimitModule {}
