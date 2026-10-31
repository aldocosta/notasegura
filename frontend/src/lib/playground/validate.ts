import { utf8Encode } from "./bytes";
import { DEFAULT_SHIFT } from "./cesar";
import { RSA_MAX_BYTES } from "./rsa-oaep";
import type { AlgorithmId, EncryptOptions } from "./types";

export const MAX_TEXT_LENGTH = 500;
const KEYWORD = /^[A-Za-z]+$/;

export function validateInput(algorithmId: AlgorithmId, text: string, options: EncryptOptions): string | null {
  if (text.length === 0) return algorithmId === "pbkdf2" ? "Escreva uma senha." : "Escreva um texto.";
  if (text.length > MAX_TEXT_LENGTH) return `O texto pode ter no máximo ${MAX_TEXT_LENGTH} caracteres.`;

  if (algorithmId === "rsa-oaep" && utf8Encode(text).length > RSA_MAX_BYTES) {
    return `O RSA-OAEP só cifra textos de até ${RSA_MAX_BYTES} bytes. Encurte o texto.`;
  }

  if (algorithmId === "vigenere") {
    const keyword = options.keyword ?? "";
    if (keyword.length === 0) return "Escreva uma palavra-chave.";
    if (!KEYWORD.test(keyword)) return "A palavra-chave deve ter apenas letras de A a Z, sem acentos.";
  }

  if (algorithmId === "cesar") {
    const shift = options.shift ?? DEFAULT_SHIFT;
    if (!Number.isInteger(shift) || shift < 1 || shift > 25) {
      return "O deslocamento deve ser um número inteiro de 1 a 25.";
    }
  }

  return null;
}
