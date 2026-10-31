import { toHex, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle } from "./web-crypto";

export async function digestHex(algorithm: "SHA-1" | "SHA-256" | "SHA-512", text: string): Promise<string> {
  return toHex(new Uint8Array(await getSubtle().digest(algorithm, utf8Encode(text))));
}

export async function encrypt(text: string): Promise<EncryptResult> {
  return { output: await digestHex("SHA-256", text), details: [] };
}
