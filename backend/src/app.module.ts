import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './presentation/health/health.module';
import { NotesModule } from './presentation/notes/notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        process.env.MONGO_URI ??
        'mongodb://localhost:27017/safenote',
    ),
    HealthModule,
    NotesModule,
  ],
})
export class AppModule {}
