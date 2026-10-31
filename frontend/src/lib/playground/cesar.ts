import type { EncryptOptions, EncryptResult } from "./types";

export const DEFAULT_SHIFT = 3;

export function shiftLetter(char: string, shift: number): string {
  const code = char.charCodeAt(0);
  const base = code >= 65 && code <= 90 ? 65 : code >= 97 && code <= 122 ? 97 : null;
  if (base === null) return char;
  return String.fromCharCode(((((code - base + shift) % 26) + 26) % 26) + base);
}

function shiftText(text: string, shift: number): string {
  return Array.from(text, (char) => shiftLetter(char, shift)).join("");
}

export async function encrypt(text: string, { shift = DEFAULT_SHIFT }: EncryptOptions = {}): Promise<EncryptResult> {
  const output = shiftText(text, shift);
  return {
    output,
    details: [{ label: "Deslocamento", value: String(shift) }],
    decrypt: async () => shiftText(output, -shift),
  };
}
