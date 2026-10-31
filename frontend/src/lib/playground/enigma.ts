import type { EncryptOptions, EncryptResult } from "./types";

// Enigma I: rotors I-II-III (left to right), reflector B, rings A-A-A, no plugboard.
const ROTORS = ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "BDFHJLCPRTXVZNYEIWGAKMUSQO"];
const NOTCHES = ["Q", "E", "V"];
const REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
const NOTE = "A Enigma só tinha letras maiúsculas.";
export const DEFAULT_START = "AAA";

const index = (letter: string) => letter.charCodeAt(0) - 65;
const letter = (n: number) => String.fromCharCode(65 + (((n % 26) + 26) % 26));

export function enigmaStep(positions: string): string {
  let [left, middle, right] = positions.split("");
  const turnLeft = middle === NOTCHES[1];
  const turnMiddle = turnLeft || right === NOTCHES[2];
  if (turnLeft) left = letter(index(left) + 1);
  if (turnMiddle) middle = letter(index(middle) + 1);
  right = letter(index(right) + 1);
  return left + middle + right;
}

function forward(wiring: string, c: number, position: number): number {
  return (index(wiring[(c + position) % 26]) - position + 26) % 26;
}

function backward(wiring: string, c: number, position: number): number {
  return (wiring.indexOf(letter(c + position)) - position + 26) % 26;
}

export function enigma(text: string, start: string): string {
  let positions = start.toUpperCase();
  let out = "";
  for (const char of text) {
    if (!/^[A-Za-z]$/.test(char)) {
      out += char;
      continue;
    }
    positions = enigmaStep(positions);
    const [left, middle, right] = positions.split("").map(index);
    let c = index(char.toUpperCase());
    c = forward(ROTORS[2], c, right);
    c = forward(ROTORS[1], c, middle);
    c = forward(ROTORS[0], c, left);
    c = index(REFLECTOR[c]);
    c = backward(ROTORS[0], c, left);
    c = backward(ROTORS[1], c, middle);
    c = backward(ROTORS[2], c, right);
    out += letter(c);
  }
  return out;
}

export async function encrypt(text: string, { start = DEFAULT_START }: EncryptOptions = {}): Promise<EncryptResult> {
  const output = enigma(text, start);
  return {
    output,
    details: [
      { label: "Posição inicial", value: start.toUpperCase() },
      { label: "Rotores", value: "I-II-III, refletor B" },
    ],
    decrypt: async () => enigma(output, start),
    note: NOTE,
  };
}
