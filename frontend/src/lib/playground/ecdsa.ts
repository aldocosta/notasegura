import { signAndShow } from "./signature";
import type { EncryptResult } from "./types";

export function encrypt(text: string): Promise<EncryptResult> {
  return signAndShow(text, {
    generate: { name: "ECDSA", namedCurve: "P-256" },
    sign: { name: "ECDSA", hash: "SHA-256" },
    publicKeyFormat: "spki",
  });
}
