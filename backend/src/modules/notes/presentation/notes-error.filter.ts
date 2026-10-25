import {
  ArgumentsHost,
  Catch,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InvalidPassphrase, NoteExpired, NoteNotFound } from '../domain/errors';

@Catch(NoteNotFound, NoteExpired, InvalidPassphrase)
export class NotesErrorFilter extends BaseExceptionFilter {
  catch(
    exception: NoteNotFound | NoteExpired | InvalidPassphrase,
    host: ArgumentsHost,
  ): void {
    if (exception instanceof InvalidPassphrase) {
      super.catch(new UnauthorizedException(exception.message), host);
      return;
    }
    super.catch(new NotFoundException(exception.message), host);
  }
}
