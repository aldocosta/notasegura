import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NoteDocument,
  NoteSchema,
} from '../../infrastructure/database/note.schema';
import { MongooseNoteRepository } from '../../infrastructure/database/mongoose-note.repository';
import { CryptoServiceImpl } from '../../infrastructure/crypto/crypto.service';
import { NoteRepository } from '../../application/repositories/note.repository';
import { CryptoService } from '../../application/services/crypto.service';
import { CreateNoteUseCase } from '../../application/use-cases/create-note.use-case';
import { GetNoteUseCase } from '../../application/use-cases/get-note.use-case';
import { NotesController } from './notes.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
  ],
  controllers: [NotesController],
  providers: [
    { provide: NoteRepository, useClass: MongooseNoteRepository },
    { provide: CryptoService, useClass: CryptoServiceImpl },
    CreateNoteUseCase,
    GetNoteUseCase,
  ],
})
export class NotesModule {}
