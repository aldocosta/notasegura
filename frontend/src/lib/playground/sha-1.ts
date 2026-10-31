import { digestHex } from "./sha-256";
import type { EncryptResult } from "./types";

export async function encrypt(text: string): Promise<EncryptResult> {
  return { output: await digestHex("SHA-1", text), details: [] };
}
