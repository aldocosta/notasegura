import { createCipheriv, randomBytes, scryptSync } from 'crypto';
import { AesGcmCryptoAdapter } from './aes-gcm-crypto.adapter';

describe('AesGcmCryptoAdapter', () => {
  const svc = new AesGcmCryptoAdapter('system-default');

  it('roundtrips plain text without passphrase using the default passphrase', () => {
    const payload = svc.encrypt('hello');
    expect(payload.salt).toBeDefined();
    expect(svc.decrypt(payload)).toBe('hello');
  });

  it('cannot decrypt a note without passphrase using another default passphrase', () => {
    const payload = svc.encrypt('hello');
    const other = new AesGcmCryptoAdapter('another-default');
    expect(() => other.decrypt(payload)).toThrow();
  });

  it('roundtrips with passphrase', () => {
    const payload = svc.encrypt('secret', 'pass');
    expect(payload.salt).toBeDefined();
    expect(svc.decrypt(payload, 'pass')).toBe('secret');
  });

  it('throws on wrong passphrase', () => {
    const payload = svc.encrypt('secret', 'pass');
    expect(() => svc.decrypt(payload, 'wrong')).toThrow();
  });

  it('requires the user passphrase when the note was created with one', () => {
    const payload = svc.encrypt('secret', 'pass');
    expect(() => svc.decrypt(payload)).toThrow();
  });

  it('requires the user passphrase even when it equals the default passphrase', () => {
    const payload = svc.encrypt('secret', 'system-default');
    expect(() => svc.decrypt(payload)).toThrow();
    expect(svc.decrypt(payload, 'system-default')).toBe('secret');
  });

  it('decrypts notes stored with a user passphrase as scrypt(passphrase, salt)', () => {
    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const key = scryptSync('pass', salt, 32);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update('saved', 'utf8'), cipher.final()]);
    const payload = {
      ciphertext: enc.toString('base64'),
      iv: iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
      salt: salt.toString('base64'),
    };
    expect(svc.decrypt(payload, 'pass')).toBe('saved');
  });

  it('decrypts legacy notes without salt with the all-zero key', () => {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', Buffer.alloc(32, 0), iv);
    const enc = Buffer.concat([
      cipher.update('legacy', 'utf8'),
      cipher.final(),
    ]);
    const payload = {
      ciphertext: enc.toString('base64'),
      iv: iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
    };
    expect(svc.decrypt(payload)).toBe('legacy');
  });

  it('rejects an empty default passphrase', () => {
    expect(() => new AesGcmCryptoAdapter('')).toThrow();
  });
});
