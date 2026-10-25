import { ArgumentsHost, HttpServer } from '@nestjs/common';
import { NotesErrorFilter } from './notes-error.filter';
import { InvalidPassphrase, NoteExpired, NoteNotFound } from '../domain/errors';

describe('NotesErrorFilter', () => {
  const reply = jest.fn();
  const response = {};
  const adapter = {
    reply,
    isHeadersSent: () => false,
    end: jest.fn(),
  } as unknown as HttpServer;
  const host = {
    getArgByIndex: (index: number) => (index === 1 ? response : {}),
  } as unknown as ArgumentsHost;

  beforeEach(() => {
    reply.mockClear();
  });

  it('maps NoteNotFound to 404 with message "Note not found or expired"', () => {
    const filter = new NotesErrorFilter(adapter);
    filter.catch(new NoteNotFound(), host);
    expect(reply).toHaveBeenCalledWith(
      response,
      {
        statusCode: 404,
        message: 'Note not found or expired',
        error: 'Not Found',
      },
      404,
    );
  });

  it('maps NoteExpired to 404 with the same body as before', () => {
    const filter = new NotesErrorFilter(adapter);
    filter.catch(new NoteExpired(), host);
    expect(reply).toHaveBeenCalledWith(
      response,
      {
        statusCode: 404,
        message: 'Note not found or expired',
        error: 'Not Found',
      },
      404,
    );
  });

  it('maps InvalidPassphrase to 401 with message "Passphrase required or invalid"', () => {
    const filter = new NotesErrorFilter(adapter);
    filter.catch(new InvalidPassphrase(), host);
    expect(reply).toHaveBeenCalledWith(
      response,
      {
        statusCode: 401,
        message: 'Passphrase required or invalid',
        error: 'Unauthorized',
      },
      401,
    );
  });
});
