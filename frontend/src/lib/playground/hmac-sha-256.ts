import { toBase64, toHex, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle, randomBytes } from "./web-crypto";

const KEY_BYTES = 32;
const HMAC = { name: "HMAC", hash: "SHA-256" };

export async function hmacSha256Hex(key: Uint8Array<ArrayBuffer>, data: Uint8Array<ArrayBuffer>): Promise<string> {
  const subtle = getSubtle();
  const cryptoKey = await subtle.importKey("raw", key, HMAC, false, ["sign"]);
  return toHex(new Uint8Array(await subtle.sign("HMAC", cryptoKey, data)));
}

export async function encrypt(text: string): Promise<EncryptResult> {
  const subtle = getSubtle();
  const rawKey = randomBytes(KEY_BYTES);
  const key = await subtle.importKey("raw", rawKey, HMAC, false, ["sign", "verify"]);
  const tag = await subtle.sign("HMAC", key, utf8Encode(text));

  return {
    output: toHex(new Uint8Array(tag)),
    details: [{ label: "Chave", value: toBase64(rawKey) }],
    verify: (candidate) => subtle.verify("HMAC", key, tag, utf8Encode(candidate)),
  };
}
