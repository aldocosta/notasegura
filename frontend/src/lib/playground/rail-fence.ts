import type { EncryptOptions, EncryptResult } from "./types";

export const DEFAULT_RAILS = 3;

function zigzagOrder(length: number, rails: number): number[] {
  const railOf: number[] = [];
  let rail = 0;
  let direction = 1;
  for (let i = 0; i < length; i++) {
    railOf.push(rail);
    if (rail === 0) direction = 1;
    else if (rail === rails - 1) direction = -1;
    rail += direction;
  }
  return railOf.map((r, i) => [r, i]).sort((x, y) => x[0] - y[0] || x[1] - y[1]).map(([, i]) => i);
}

function railEncrypt(text: string, rails: number): string {
  const chars = Array.from(text);
  return zigzagOrder(chars.length, rails)
    .map((i) => chars[i])
    .join("");
}

function railDecrypt(text: string, rails: number): string {
  const chars = Array.from(text);
  const out: string[] = new Array(chars.length);
  zigzagOrder(chars.length, rails).forEach((position, i) => {
    out[position] = chars[i];
  });
  return out.join("");
}

export async function encrypt(text: string, { rails = DEFAULT_RAILS }: EncryptOptions = {}): Promise<EncryptResult> {
  const output = railEncrypt(text, rails);
  return {
    output,
    details: [{ label: "Trilhos", value: String(rails) }],
    decrypt: async () => railDecrypt(output, rails),
  };
}
