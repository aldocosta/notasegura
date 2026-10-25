import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { NotesErrorFilter } from './presentation/notes-error.filter';

@Module({
  providers: [{ provide: APP_FILTER, useClass: NotesErrorFilter }],
})
export class NotesModule {}
