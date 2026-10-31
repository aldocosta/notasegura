import { describe, expect, it } from "vitest";
import { encrypt } from "./vigenere";

describe("Cifra de Vigenère", () => {
  it("matches the classic example", async () => {
    expect((await encrypt("ATTACKATDAWN", { keyword: "LEMON" })).output).toBe("LXFOPVEFRNHR");
  });

  it("keeps case and skips non-letters for the key index", async () => {
    expect((await encrypt("attack at dawn", { keyword: "lemon" })).output).toBe("lxfopv ef rnhr");
  });

  it("decrypts back", async () => {
    const result = await encrypt("Olá, mundo! 123", { keyword: "chave" });
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });
});
