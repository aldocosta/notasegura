// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64 } from "./bytes";
import { encrypt } from "./ecdh";
import type { EncryptResult } from "./types";

function detail(result: EncryptResult, label: string): string {
  const found = result.details.find((d) => d.label === label);
  expect(found, label).toBeDefined();
  return found!.value;
}

describe("ECDH", () => {
  it("computes the same secret on both sides", async () => {
    const result = await encrypt("segredo");
    const ana = detail(result, "Segredo calculado por Ana");
    expect(detail(result, "Segredo calculado por Beto")).toBe(ana);
    expect(fromBase64(ana)).toHaveLength(32);
  });

  it("round-trips", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });

  it("shows both public keys", async () => {
    const result = await encrypt("segredo");
    const ana = detail(result, "Chave pública de Ana");
    const beto = detail(result, "Chave pública de Beto");
    expect(beto).not.toBe(ana);
    expect(fromBase64(ana)).toHaveLength(65);
    expect(fromBase64(beto)).toHaveLength(65);
  });
});
