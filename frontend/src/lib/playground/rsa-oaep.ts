import { toBase64, utf8Decode, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle } from "./web-crypto";

export const RSA_MAX_BYTES = 190;

export async function encrypt(text: string): Promise<EncryptResult> {
  const subtle = getSubtle();
  const { publicKey, privateKey } = await subtle.generateKey(
    { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["encrypt", "decrypt"],
  );
  const ciphertext = await subtle.encrypt({ name: "RSA-OAEP" }, publicKey, utf8Encode(text));
  const spki = new Uint8Array(await subtle.exportKey("spki", publicKey));

  return {
    output: toBase64(new Uint8Array(ciphertext)),
    details: [{ label: "Chave pública", value: toBase64(spki) }],
    decrypt: async () => utf8Decode(new Uint8Array(await subtle.decrypt({ name: "RSA-OAEP" }, privateKey, ciphertext))),
  };
}
