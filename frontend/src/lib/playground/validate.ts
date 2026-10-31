import { utf8Encode } from "./bytes";
import { DEFAULT_SHIFT } from "./cesar";
import { DEFAULT_START } from "./enigma";
import { playfairLetters } from "./playfair";
import { DEFAULT_RAILS } from "./rail-fence";
import { RSA_MAX_BYTES } from "./rsa-oaep";
import type { AlgorithmId, EncryptOptions } from "./types";

export const MAX_TEXT_LENGTH = 500;
const KEYWORD = /^[A-Za-z]+$/;
const START = /^[A-Za-z]{3}$/;

export function validateInput(algorithmId: AlgorithmId, text: string, options: EncryptOptions): string | null {
  if (text.length === 0) return algorithmId === "pbkdf2" ? "Escreva uma senha." : "Escreva um texto.";
  if (text.length > MAX_TEXT_LENGTH) return `O texto pode ter no máximo ${MAX_TEXT_LENGTH} caracteres.`;

  if (algorithmId === "rsa-oaep" && utf8Encode(text).length > RSA_MAX_BYTES) {
    return `O RSA-OAEP só cifra textos de até ${RSA_MAX_BYTES} bytes. Encurte o texto.`;
  }

  if (algorithmId === "vigenere" || algorithmId === "playfair") {
    const keyword = options.keyword ?? "";
    if (keyword.length === 0) return "Escreva uma palavra-chave.";
    if (!KEYWORD.test(keyword)) return "A palavra-chave deve ter apenas letras de A a Z, sem acentos.";
  }

  if (algorithmId === "playfair" && playfairLetters(text).length === 0) {
    return "O texto precisa ter pelo menos uma letra de A a Z.";
  }

  if (algorithmId === "cesar") {
    const shift = options.shift ?? DEFAULT_SHIFT;
    if (!Number.isInteger(shift) || shift < 1 || shift > 25) {
      return "O deslocamento deve ser um número inteiro de 1 a 25.";
    }
  }

  if (algorithmId === "rail-fence") {
    const rails = options.rails ?? DEFAULT_RAILS;
    if (!Number.isInteger(rails) || rails < 2 || rails > 10) {
      return "O número de trilhos deve ser um inteiro de 2 a 10.";
    }
  }

  if (algorithmId === "enigma" && !START.test(options.start ?? DEFAULT_START)) {
    return "A posição inicial deve ter três letras de A a Z.";
  }

  return null;
}
