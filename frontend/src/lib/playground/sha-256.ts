import { utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle } from "./web-crypto";

export async function encrypt(text: string): Promise<EncryptResult> {
  const digest = new Uint8Array(await getSubtle().digest("SHA-256", utf8Encode(text)));
  const output = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return { output, details: [] };
}
