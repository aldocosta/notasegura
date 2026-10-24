import { Injectable } from '@nestjs/common';
import { Note } from '../../domain/note.entity';
import { NoteRepository } from '../repositories/note.repository';
import { CryptoService } from '../services/crypto.service';
export interface CreateNoteInput {
  text: string;
  passphrase?: string;
  expiresInDays: number;
  maxViews: number;
}
@Injectable()
export class CreateNoteUseCase {
  constructor(
    private readonly repo: NoteRepository,
    private readonly crypto: CryptoService,
  ) {}
  async execute(input: CreateNoteInput): Promise<Note> {
    const payload = this.crypto.encrypt(input.text, input.passphrase);
    const expiresAt = new Date(
      Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000,
    );
    const note = new Note({ ...payload, expiresAt, maxViews: input.maxViews });
    return this.repo.create(note);
  }
}
