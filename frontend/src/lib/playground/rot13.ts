import { shiftLetter } from "./cesar";
import type { EncryptResult } from "./types";

function rot13(text: string): string {
  return Array.from(text, (char) => shiftLetter(char, 13)).join("");
}

export async function encrypt(text: string): Promise<EncryptResult> {
  const output = rot13(text);
  return { output, details: [], decrypt: async () => rot13(output) };
}
