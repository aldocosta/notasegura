import { CreateNoteUseCase } from './create-note.use-case';
import { NoteRepository } from '../repositories/note.repository';
import { CryptoService } from '../services/crypto.service';

describe('CreateNoteUseCase', () => {
  it('encrypts and persists note', async () => {
    const encryptMock = jest
      .fn()
      .mockReturnValue({ ciphertext: 'c', iv: 'i', tag: 't' });
    const createMock = jest.fn().mockResolvedValue({ id: '1' });
    const repo = {
      create: createMock,
    } as unknown as NoteRepository;
    const crypto = {
      encrypt: encryptMock,
    } as unknown as CryptoService;
    const uc = new CreateNoteUseCase(repo, crypto);
    const res = await uc.execute({ text: 'hi', expiresInDays: 2, maxViews: 3 });
    expect(encryptMock).toHaveBeenCalledWith('hi', undefined);
    expect(createMock).toHaveBeenCalled();
    expect(res).toEqual({ id: '1' });
  });
});
