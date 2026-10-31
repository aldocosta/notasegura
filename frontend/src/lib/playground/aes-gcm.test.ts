// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64 } from "./bytes";
import { encrypt } from "./aes-gcm";
import type { EncryptResult } from "./types";

function detail(result: EncryptResult, label: string): string {
  const found = result.details.find((d) => d.label === label);
  expect(found, label).toBeDefined();
  return found!.value;
}

describe("AES-256-GCM", () => {
  it("round-trips", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });

  it("shows a 256-bit key and a 12-byte IV", async () => {
    const result = await encrypt("segredo");
    expect(fromBase64(detail(result, "Chave"))).toHaveLength(32);
    expect(fromBase64(detail(result, "IV"))).toHaveLength(12);
  });

  it("uses a new key and IV each time", async () => {
    const first = await encrypt("segredo");
    const second = await encrypt("segredo");
    expect(second.output).not.toBe(first.output);
    expect(detail(second, "Chave")).not.toBe(detail(first, "Chave"));
    expect(detail(second, "IV")).not.toBe(detail(first, "IV"));
  });

  it("output includes the 16-byte tag", async () => {
    const result = await encrypt("segredo");
    expect(fromBase64(result.output)).toHaveLength(23);
  });
});
