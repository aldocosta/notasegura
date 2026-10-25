import { AesGcmCryptoAdapter } from './aes-gcm-crypto.adapter';

describe('AesGcmCryptoAdapter', () => {
  const svc = new AesGcmCryptoAdapter();

  it('roundtrips plain text without passphrase', () => {
    const payload = svc.encrypt('hello');
    expect(svc.decrypt(payload)).toBe('hello');
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

  it('requires passphrase when salt present', () => {
    const payload = svc.encrypt('secret', 'pass');
    expect(() => svc.decrypt(payload)).toThrow();
  });
});
