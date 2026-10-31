// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64, utf8Encode } from "./bytes";
import { encrypt, hmacSha256Hex } from "./hmac-sha-256";

describe("HMAC-SHA-256", () => {
  it("matches RFC 4231 case 2", async () => {
    expect(await hmacSha256Hex(utf8Encode("Jefe"), utf8Encode("what do ya want for nothing?"))).toBe(
      "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
    );
  });

  it("verifies the same text only", async () => {
    const result = await encrypt("segredo");
    expect(await result.verify!("segredo")).toBe(true);
    expect(await result.verify!("segredO")).toBe(false);
  });

  it("shows a 256-bit key", async () => {
    const result = await encrypt("segredo");
    expect(result.output).toMatch(/^[0-9a-f]{64}$/);
    expect(result.details).toHaveLength(1);
    expect(result.details[0].label).toBe("Chave");
    expect(fromBase64(result.details[0].value)).toHaveLength(32);
  });

  it("has no decrypt", async () => {
    expect((await encrypt("segredo")).decrypt).toBeUndefined();
  });
});
