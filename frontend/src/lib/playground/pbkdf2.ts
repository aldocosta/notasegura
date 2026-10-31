import { equalBytes, toBase64, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle, randomBytes } from "./web-crypto";

export const PBKDF2_ITERATIONS = 600000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

export async function pbkdf2Sha256(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
  bytes: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const subtle = getSubtle();
  const baseKey = await subtle.importKey("raw", utf8Encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, baseKey, bytes * 8);
  return new Uint8Array(bits);
}

export async function encrypt(password: string): Promise<EncryptResult> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await pbkdf2Sha256(password, salt, PBKDF2_ITERATIONS, KEY_BYTES);

  return {
    output: toBase64(derived),
    details: [
      { label: "Sal", value: toBase64(salt) },
      { label: "Iterações", value: String(PBKDF2_ITERATIONS) },
    ],
    verify: async (candidate) =>
      equalBytes(derived, await pbkdf2Sha256(candidate, salt, PBKDF2_ITERATIONS, KEY_BYTES)),
  };
}
