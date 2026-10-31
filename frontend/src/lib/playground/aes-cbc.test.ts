// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64 } from "./bytes";
import { encrypt } from "./aes-cbc";
import type { EncryptResult } from "./types";

function detail(result: EncryptResult, label: string): string {
  const found = result.details.find((d) => d.label === label);
  expect(found, label).toBeDefined();
  return found!.value;
}

describe("AES-256-CBC", () => {
  it("round-trips", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });

  it("shows a 256-bit key and a 16-byte IV", async () => {
    const result = await encrypt("segredo");
    expect(fromBase64(detail(result, "Chave"))).toHaveLength(32);
    expect(fromBase64(detail(result, "IV"))).toHaveLength(16);
  });

  it("pads to the block size", async () => {
    expect(fromBase64((await encrypt("segredo")).output)).toHaveLength(16);
    expect(fromBase64((await encrypt("a".repeat(16))).output)).toHaveLength(32);
  });
});
