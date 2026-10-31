import { shiftLetter } from "./cesar";
import type { EncryptOptions, EncryptResult } from "./types";

const LETTER = /^[A-Za-z]$/;

function applyKeyword(text: string, keyword: string, direction: 1 | -1): string {
  const shifts = Array.from(keyword.toLowerCase(), (char) => char.charCodeAt(0) - 97);
  let index = 0;
  return Array.from(text, (char) => {
    if (!LETTER.test(char)) return char;
    const shifted = shiftLetter(char, direction * shifts[index % shifts.length]);
    index++;
    return shifted;
  }).join("");
}

export async function encrypt(text: string, { keyword = "" }: EncryptOptions = {}): Promise<EncryptResult> {
  const output = applyKeyword(text, keyword, 1);
  return {
    output,
    details: [{ label: "Palavra-chave", value: keyword }],
    decrypt: async () => applyKeyword(output, keyword, -1),
  };
}
