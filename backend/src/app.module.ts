import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './presentation/health/health.module';
import { NotesModule } from './presentation/notes/notes.module';
import { NotesModule as NotesErrorModule } from './modules/notes/notes.module';
import { LoggingModule } from './presentation/logging/logging.module';
import { RequestCompletionInterceptor } from './presentation/logging/request-completion.interceptor';
import { RateLimitModule } from './presentation/rate-limit/rate-limit.module';
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
    NotesErrorModule,
    HealthModule,
    NotesModule,
    LoggingModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: RequestCompletionInterceptor },
  ],
})
export class AppModule {}
