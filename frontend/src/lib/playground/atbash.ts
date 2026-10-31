import type { EncryptResult } from "./types";

function mirror(char: string): string {
  const code = char.charCodeAt(0);
  const base = code >= 65 && code <= 90 ? 65 : code >= 97 && code <= 122 ? 97 : null;
  if (base === null) return char;
  return String.fromCharCode(base + 25 - (code - base));
}

function atbash(text: string): string {
  return Array.from(text, mirror).join("");
}

export async function encrypt(text: string): Promise<EncryptResult> {
  const output = atbash(text);
  return { output, details: [], decrypt: async () => atbash(output) };
}
