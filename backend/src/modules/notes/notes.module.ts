import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  NoteDocument,
  NoteSchema,
} from './infrastructure/persistence/note.schema';
import { MongooseNoteRepository } from './infrastructure/persistence/mongoose-note.repository';
import { AesGcmCryptoAdapter } from './infrastructure/crypto/aes-gcm-crypto.adapter';
import { NoteRepository } from './domain/note.repository';
import { CryptoService } from './domain/crypto.service';
import { CreateNoteUseCase } from './application/create-note.use-case';
import { GetNoteUseCase } from './application/get-note.use-case';
import { NotesController } from './presentation/notes.controller';
import { NotesErrorFilter } from './presentation/notes-error.filter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
  ],
  controllers: [NotesController],
  providers: [
    { provide: NoteRepository, useClass: MongooseNoteRepository },
    {
      provide: CryptoService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new AesGcmCryptoAdapter(
          config.getOrThrow<string>('NOTE_DEFAULT_PASSPHRASE'),
        ),
    },
    CreateNoteUseCase,
    GetNoteUseCase,
    { provide: APP_FILTER, useClass: NotesErrorFilter },
  ],
})
export class NotesModule {}
