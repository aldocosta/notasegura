import { toBase64, utf8Decode, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle, randomBytes } from "./web-crypto";

const IV_BYTES = 16;

export async function encrypt(text: string): Promise<EncryptResult> {
  const subtle = getSubtle();
  const key = await subtle.generateKey({ name: "AES-CBC", length: 256 }, true, ["encrypt", "decrypt"]);
  const iv = randomBytes(IV_BYTES);
  const params = { name: "AES-CBC", iv };
  const ciphertext = await subtle.encrypt(params, key, utf8Encode(text));
  const rawKey = new Uint8Array(await subtle.exportKey("raw", key));

  return {
    output: toBase64(new Uint8Array(ciphertext)),
    details: [
      { label: "Chave", value: toBase64(rawKey) },
      { label: "IV", value: toBase64(iv) },
    ],
    decrypt: async () => utf8Decode(new Uint8Array(await subtle.decrypt(params, key, ciphertext))),
  };
}
