import { DomainError } from '../../../platform/errors/domain-error';

export class NoteNotFound extends DomainError {
  constructor() {
    super('note_not_found', 'Note not found or expired');
  }
}

export class NoteExpired extends DomainError {
  constructor() {
    super('note_expired', 'Note not found or expired');
  }
}

export class InvalidPassphrase extends DomainError {
  constructor() {
    super('invalid_passphrase', 'Passphrase required or invalid');
  }
}
