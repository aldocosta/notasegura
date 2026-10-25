import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateNoteUseCase } from '../application/create-note.use-case';
import { GetNoteUseCase } from '../application/get-note.use-case';
import { CreateNoteDto } from './create-note.dto';
@Controller('notes')
export class NotesController {
  constructor(
    private readonly createUseCase: CreateNoteUseCase,
    private readonly getUseCase: GetNoteUseCase,
  ) {}
  @Post() async create(@Body() dto: CreateNoteDto) {
    const note = await this.createUseCase.execute(dto);
    return { id: note.id, url: `/notes/${note.id}` };
  }
  @Get(':id') async get(
    @Param('id') id: string,
    @Query('passphrase') passphrase?: string,
  ) {
    const text = await this.getUseCase.execute(id, passphrase);
    return { text };
  }
}
