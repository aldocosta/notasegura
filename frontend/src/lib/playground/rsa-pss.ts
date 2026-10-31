import { signAndShow } from "./signature";
import type { EncryptResult } from "./types";

export function encrypt(text: string): Promise<EncryptResult> {
  return signAndShow(text, {
    generate: { name: "RSA-PSS", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    sign: { name: "RSA-PSS", saltLength: 32 },
    publicKeyFormat: "spki",
  });
}
