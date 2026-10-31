import { toBase64, utf8Decode, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { randomBytes } from "./web-crypto";

function xor(data: Uint8Array, key: Uint8Array): Uint8Array {
  return data.map((byte, i) => byte ^ key[i]);
}

export async function encrypt(text: string): Promise<EncryptResult> {
  const plain = utf8Encode(text);
  const key = randomBytes(plain.length);
  const ciphertext = xor(plain, key);
  return {
    output: toBase64(ciphertext),
    details: [{ label: "Chave", value: toBase64(key) }],
    decrypt: async () => utf8Decode(xor(ciphertext, key)),
  };
}
