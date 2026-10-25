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
@Injectable()
export class AesGcmCryptoAdapter extends ICryptoService {
  private deriveKey(
    passphrase?: string,
    salt?: Buffer,
  ): { key: Buffer; salt?: Buffer } {
    if (!passphrase) return { key: Buffer.alloc(32, 0) };
    const s = salt ?? randomBytes(16);
    const key = scryptSync(passphrase, s, 32);
    return { key, salt: s };
  }
  encrypt(plain: string, passphrase?: string): EncryptedPayload {
    const iv = randomBytes(12);
    const { key, salt } = this.deriveKey(passphrase);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
      ciphertext: enc.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      salt: salt?.toString('base64'),
    };
  }
  decrypt(payload: EncryptedPayload, passphrase?: string): string {
    const iv = Buffer.from(payload.iv, 'base64');
    const salt = payload.salt ? Buffer.from(payload.salt, 'base64') : undefined;
    const { key } = this.deriveKey(passphrase, salt);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64')),
      decipher.final(),
    ]);
    return dec.toString('utf8');
  }
}
