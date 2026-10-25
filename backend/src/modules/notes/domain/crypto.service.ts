export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
  salt?: string;
}
export abstract class CryptoService {
  abstract encrypt(plain: string, passphrase?: string): EncryptedPayload;
  abstract decrypt(payload: EncryptedPayload, passphrase?: string): string;
}
