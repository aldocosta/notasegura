// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64 } from "./bytes";
import { encrypt } from "./aes-ctr";
import type { EncryptResult } from "./types";

function detail(result: EncryptResult, label: string): string {
  const found = result.details.find((d) => d.label === label);
  expect(found, label).toBeDefined();
  return found!.value;
}

describe("AES-256-CTR", () => {
  it("round-trips", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });

  it("keeps the length", async () => {
    expect(fromBase64((await encrypt("segredo")).output)).toHaveLength(7);
  });

  it("shows a 256-bit key and a 16-byte counter", async () => {
    const result = await encrypt("segredo");
    expect(fromBase64(detail(result, "Chave"))).toHaveLength(32);
    expect(fromBase64(detail(result, "Contador"))).toHaveLength(16);
  });

  it("uses new values each time", async () => {
    const first = await encrypt("segredo");
    const second = await encrypt("segredo");
    expect(second.output).not.toBe(first.output);
    expect(detail(second, "Chave")).not.toBe(detail(first, "Chave"));
    expect(detail(second, "Contador")).not.toBe(detail(first, "Contador"));
  });
});
