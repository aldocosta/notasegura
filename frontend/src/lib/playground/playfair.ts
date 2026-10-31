import type { EncryptOptions, EncryptResult } from "./types";

const ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const NOTE = "A Playfair remove espaços e acentos, troca J por I e insere X entre letras repetidas.";

export function playfairLetters(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
}

export function playfairGrid(keyword: string): string[] {
  const grid: string[] = [];
  for (const letter of playfairLetters(keyword) + ALPHABET) {
    if (!grid.includes(letter)) grid.push(letter);
  }
  return grid;
}

function prepare(text: string): string {
  const letters = playfairLetters(text);
  let out = "";
  for (let i = 0; i < letters.length; ) {
    const a = letters[i];
    const b = letters[i + 1];
    if (b === undefined || a === b) {
      out += a + "X";
      i++;
    } else {
      out += a + b;
      i += 2;
    }
  }
  return out;
}

function transform(pairs: string, grid: string[], direction: 1 | -1): string {
  let out = "";
  for (let i = 0; i < pairs.length; i += 2) {
    const a = grid.indexOf(pairs[i]);
    const b = grid.indexOf(pairs[i + 1]);
    const [rowA, colA, rowB, colB] = [Math.floor(a / 5), a % 5, Math.floor(b / 5), b % 5];
    if (rowA === rowB) {
      out += grid[rowA * 5 + ((colA + direction + 5) % 5)] + grid[rowB * 5 + ((colB + direction + 5) % 5)];
    } else if (colA === colB) {
      out += grid[((rowA + direction + 5) % 5) * 5 + colA] + grid[((rowB + direction + 5) % 5) * 5 + colB];
    } else {
      out += grid[rowA * 5 + colB] + grid[rowB * 5 + colA];
    }
  }
  return out;
}

export async function encrypt(text: string, { keyword = "" }: EncryptOptions = {}): Promise<EncryptResult> {
  const grid = playfairGrid(keyword);
  const output = transform(prepare(text), grid, 1);
  const rows = Array.from({ length: 5 }, (_, i) => grid.slice(i * 5, i * 5 + 5).join(""));
  return {
    output,
    details: [
      { label: "Palavra-chave", value: keyword },
      { label: "Grade", value: rows.join(" ") },
    ],
    decrypt: async () => transform(output, grid, -1),
    note: NOTE,
  };
}
