import { toBase64, utf8Decode, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle, randomBytes } from "./web-crypto";

const COUNTER_BYTES = 16;
const COUNTER_BITS = 64;

export async function encrypt(text: string): Promise<EncryptResult> {
  const subtle = getSubtle();
  const key = await subtle.generateKey({ name: "AES-CTR", length: 256 }, true, ["encrypt", "decrypt"]);
  const counter = randomBytes(COUNTER_BYTES);
  const params = { name: "AES-CTR", counter, length: COUNTER_BITS };
  const ciphertext = await subtle.encrypt(params, key, utf8Encode(text));
  const rawKey = new Uint8Array(await subtle.exportKey("raw", key));

  return {
    output: toBase64(new Uint8Array(ciphertext)),
    details: [
      { label: "Chave", value: toBase64(rawKey) },
      { label: "Contador", value: toBase64(counter) },
    ],
    decrypt: async () => utf8Decode(new Uint8Array(await subtle.decrypt(params, key, ciphertext))),
  };
}
