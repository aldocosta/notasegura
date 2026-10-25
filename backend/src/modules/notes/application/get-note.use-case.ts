import { Injectable } from '@nestjs/common';
import { NoteRepository } from '../domain/note.repository';
import { CryptoService } from '../domain/crypto.service';
import {
  InvalidPassphrase,
  NoteExpired,
  NoteNotFound,
} from '../domain/errors';
@Injectable()
export class GetNoteUseCase {
  constructor(
    private readonly repo: NoteRepository,
    private readonly crypto: CryptoService,
  ) {}
  async execute(id: string, passphrase?: string): Promise<string> {
    const note = await this.repo.findById(id);
    if (!note) throw new NoteNotFound();
    if (note.isExpired()) throw new NoteExpired();
    let text: string;
    try {
      text = this.crypto.decrypt(
        {
          ciphertext: note.ciphertext,
          iv: note.iv,
          tag: note.tag,
          salt: note.salt,
        },
        passphrase,
      );
    } catch {
      throw new InvalidPassphrase();
    }
    note.consumeView();
    await this.repo.update(note);
    return text;
  }
}
