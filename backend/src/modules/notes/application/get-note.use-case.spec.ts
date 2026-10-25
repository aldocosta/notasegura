import { GetNoteUseCase } from './get-note.use-case';
import { NoteRepository } from '../domain/note.repository';
import { CryptoService } from '../domain/crypto.service';
import { Note } from '../domain/note.entity';
import {
  InvalidPassphrase,
  NoteExpired,
  NoteNotFound,
} from '../domain/errors';

describe('GetNoteUseCase', () => {
  const makeNote = (overrides: Record<string, unknown> = {}) =>
    new Note({
      ciphertext: 'c',
      iv: 'i',
      tag: 't',
      expiresAt: new Date(Date.now() + 86400000),
      maxViews: 2,
      views: 0,
      ...(overrides as Partial<Note>),
    });

  it('throws 404 when not found', async () => {
    const repo = {
      findById: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    } as unknown as NoteRepository;
    const crypto = { decrypt: jest.fn() } as unknown as CryptoService;
    const uc = new GetNoteUseCase(repo, crypto);
    await expect(uc.execute('x')).rejects.toThrow(NoteNotFound);
  });

  it('throws 404 when expired', async () => {
    const note = makeNote({ expiresAt: new Date(Date.now() - 1000) });
    const repo = {
      findById: jest.fn().mockResolvedValue(note),
      update: jest.fn(),
    } as unknown as NoteRepository;
    const crypto = { decrypt: jest.fn() } as unknown as CryptoService;
    const uc = new GetNoteUseCase(repo, crypto);
    await expect(uc.execute('x')).rejects.toThrow(NoteExpired);
  });

  it('throws 401 on bad passphrase', async () => {
    const note = makeNote();
    const repo = {
      findById: jest.fn().mockResolvedValue(note),
      update: jest.fn(),
    } as unknown as NoteRepository;
    const crypto = {
      decrypt: jest.fn().mockImplementation(() => {
        throw new Error('bad');
      }),
    } as unknown as CryptoService;
    const uc = new GetNoteUseCase(repo, crypto);
    await expect(uc.execute('x', 'wrong')).rejects.toThrow(InvalidPassphrase);
  });

  it('returns text, consumes view, updates', async () => {
    const note = makeNote();
    const updateMock = jest.fn().mockResolvedValue(note);
    const repo = {
      findById: jest.fn().mockResolvedValue(note),
      update: updateMock,
    } as unknown as NoteRepository;
    const crypto = {
      decrypt: jest.fn().mockReturnValue('hello'),
    } as unknown as CryptoService;
    const uc = new GetNoteUseCase(repo, crypto);
    const text = await uc.execute('x');
    expect(text).toBe('hello');
    expect(note.views).toBe(1);
    expect(updateMock).toHaveBeenCalled();
  });
});
