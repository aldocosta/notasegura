export class WebCryptoUnavailableError extends Error {
  constructor() {
    super("Web Crypto API unavailable");
    this.name = "WebCryptoUnavailableError";
  }
}

export class AlgorithmUnsupportedError extends Error {
  constructor() {
    super("Algorithm not supported by this browser");
    this.name = "AlgorithmUnsupportedError";
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

export async function generateOrUnsupported<T>(generate: () => Promise<T>): Promise<T> {
  try {
    return await generate();
  } catch (err) {
    if (err instanceof Error && err.name === "NotSupportedError") throw new AlgorithmUnsupportedError();
    throw err;
  }
}
