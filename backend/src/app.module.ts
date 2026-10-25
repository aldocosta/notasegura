import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './platform/health/health.module';
import { NotesModule } from './modules/notes/notes.module';
import { LoggingModule } from './platform/logging/logging.module';
import { RateLimitModule } from './platform/rate-limit/rate-limit.module';
import { ErrorsModule } from './platform/errors/errors.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        process.env.MONGO_URI ??
        'mongodb://localhost:27017/safenote',
    ),
    // Nest checks global filters in reverse registration order. The catch-all
    // must be registered before the notes filter, or domain errors become 500.
    ErrorsModule,
    HealthModule,
    NotesModule,
    LoggingModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
