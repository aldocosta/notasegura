import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';
import {
  CryptoService as ICryptoService,
  EncryptedPayload,
} from '../../domain/crypto.service';

// Notes saved before the default passphrase existed have no salt and were
// encrypted with an all-zero key. They expire within 7 days of creation.
const LEGACY_KEY = Buffer.alloc(32, 0);

// Keeps default-passphrase keys distinct from user-passphrase keys, so a user
// passphrase equal to the default never makes a protected note readable
// without it. User keys must stay scrypt(passphrase, salt) for stored notes.
const DEFAULT_KEY_CONTEXT = Buffer.from('notasegura:default-passphrase');

@Injectable()
export class AesGcmCryptoAdapter extends ICryptoService {
  constructor(private readonly defaultPassphrase: string) {
    super();
    if (!defaultPassphrase) {
      throw new Error('NOTE_DEFAULT_PASSPHRASE must not be empty');
    }
  }

  private deriveKey(passphrase: string | undefined, salt: Buffer): Buffer {
    if (passphrase) return scryptSync(passphrase, salt, 32);
    return scryptSync(
      this.defaultPassphrase,
      Buffer.concat([salt, DEFAULT_KEY_CONTEXT]),
      32,
    );
  }

  encrypt(plain: string, passphrase?: string): EncryptedPayload {
    const iv = randomBytes(12);
    const salt = randomBytes(16);
    const key = this.deriveKey(passphrase, salt);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
      ciphertext: enc.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      salt: salt.toString('base64'),
    };
  }

  decrypt(payload: EncryptedPayload, passphrase?: string): string {
    const iv = Buffer.from(payload.iv, 'base64');
    const key = payload.salt
      ? this.deriveKey(passphrase, Buffer.from(payload.salt, 'base64'))
      : LEGACY_KEY;
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64')),
      decipher.final(),
    ]);
    return dec.toString('utf8');
  }
}
