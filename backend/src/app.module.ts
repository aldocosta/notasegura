import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './presentation/health/health.module';
import { NotesModule } from './presentation/notes/notes.module';
import { LoggingModule } from './presentation/logging/logging.module';
import { RequestCompletionInterceptor } from './presentation/logging/request-completion.interceptor';

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
    HealthModule,
    NotesModule,
    LoggingModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: RequestCompletionInterceptor }],
})
export class AppModule {}
