import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NoteRepository } from '../repositories/note.repository';
import { CryptoService } from '../services/crypto.service';
@Injectable()
export class GetNoteUseCase {
  constructor(
    private readonly repo: NoteRepository,
    private readonly crypto: CryptoService,
  ) {}
  async execute(id: string, passphrase?: string): Promise<string> {
    const note = await this.repo.findById(id);
    if (!note || note.isExpired())
      throw new NotFoundException('Note not found or expired');
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
      throw new UnauthorizedException('Passphrase required or invalid');
    }
    note.consumeView();
    await this.repo.update(note);
    return text;
  }
}
