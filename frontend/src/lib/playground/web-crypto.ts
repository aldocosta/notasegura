export class WebCryptoUnavailableError extends Error {
  constructor() {
    super("Web Crypto API unavailable");
    this.name = "WebCryptoUnavailableError";
  }
}

export function getSubtle(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new WebCryptoUnavailableError();
  return subtle;
}

export function randomBytes(length: number) {
  return globalThis.crypto.getRandomValues(new Uint8Array(length));
}
