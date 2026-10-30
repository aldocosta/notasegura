import { CreateNoteUseCase } from './create-note.use-case';
import { NoteRepository } from '../domain/note.repository';
import { CryptoService } from '../domain/crypto.service';
import { Note } from '../domain/note.entity';

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

  it('persists the note with the requested expiry and view limit', async () => {
    const encryptMock = jest
      .fn()
      .mockReturnValue({ ciphertext: 'c', iv: 'i', tag: 't' });
    const persisted: Note[] = [];
    const createMock = jest.fn((note: Note) => {
      persisted.push(note);
      return note;
    });
    const repo = { create: createMock } as unknown as NoteRepository;
    const crypto = { encrypt: encryptMock } as unknown as CryptoService;
    const uc = new CreateNoteUseCase(repo, crypto);
    const dayMs = 24 * 60 * 60 * 1000;
    const before = Date.now();
    await uc.execute({ text: 'hi', expiresInDays: 2, maxViews: 3 });
    const after = Date.now();
    expect(persisted[0].maxViews).toBe(3);
    expect(persisted[0].expiresAt.getTime()).toBeGreaterThanOrEqual(
      before + 2 * dayMs,
    );
    expect(persisted[0].expiresAt.getTime()).toBeLessThanOrEqual(
      after + 2 * dayMs,
    );
  });

  describe('with a fixed clock', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('sets expiresAt 30 days after creation', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00Z'));
      const encryptMock = jest
        .fn()
        .mockReturnValue({ ciphertext: 'c', iv: 'i', tag: 't' });
      const persisted: Note[] = [];
      const createMock = jest.fn((note: Note) => {
        persisted.push(note);
        return note;
      });
      const repo = { create: createMock } as unknown as NoteRepository;
      const crypto = { encrypt: encryptMock } as unknown as CryptoService;
      const uc = new CreateNoteUseCase(repo, crypto);

      await uc.execute({ text: 'hi', expiresInDays: 30, maxViews: 50 });

      expect(persisted[0].expiresAt).toEqual(new Date('2026-01-31T00:00:00Z'));
      expect(persisted[0].maxViews).toBe(50);
    });
  });
});
