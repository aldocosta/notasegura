// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { encrypt } from "./vernam";

function key(result: EncryptResult): Uint8Array {
  const found = result.details.find((d) => d.label === "Chave");
  expect(found).toBeDefined();
  return fromBase64(found!.value);
}

describe("Cifra de Vernam", () => {
  it("round-trips", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });

  it("uses a key as long as the text", async () => {
    expect(key(await encrypt("olá"))).toHaveLength(4);
  });

  it("XORs the key", async () => {
    const text = "Olá, mundo! 123";
    const result = await encrypt(text);
    const output = fromBase64(result.output);
    const keyBytes = key(result);
    expect(Array.from(output, (byte, i) => byte ^ keyBytes[i])).toEqual(Array.from(utf8Encode(text)));
  });

  it("uses a new key each time", async () => {
    const first = await encrypt("segredo");
    const second = await encrypt("segredo");
    expect(Array.from(key(second))).not.toEqual(Array.from(key(first)));
  });
});
