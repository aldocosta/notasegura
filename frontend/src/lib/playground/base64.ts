import { fromBase64, toBase64, utf8Decode, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";

export async function encrypt(text: string): Promise<EncryptResult> {
  const output = toBase64(utf8Encode(text));
  return {
    output,
    details: [],
    decrypt: async () => utf8Decode(fromBase64(output)),
  };
}
