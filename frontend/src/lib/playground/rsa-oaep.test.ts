// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64 } from "./bytes";
import { encrypt } from "./rsa-oaep";

describe("RSA-OAEP", () => {
  it("round-trips", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });

  it("shows only the public key", async () => {
    const result = await encrypt("segredo");
    expect(result.details).toHaveLength(1);
    expect(result.details[0].label).toBe("Chave pública");
    for (const d of result.details) {
      expect(d.label.toLowerCase()).not.toContain("privada");
    }
  });

  it("produces a 256-byte ciphertext", async () => {
    expect(fromBase64((await encrypt("segredo")).output)).toHaveLength(256);
  });
});
