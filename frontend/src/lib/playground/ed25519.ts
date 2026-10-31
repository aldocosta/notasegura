import { signAndShow } from "./signature";
import type { EncryptResult } from "./types";

export function encrypt(text: string): Promise<EncryptResult> {
  return signAndShow(text, { generate: { name: "Ed25519" }, sign: { name: "Ed25519" }, publicKeyFormat: "raw" });
}
