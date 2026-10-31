import { describe, expect, it } from "vitest";
import { encrypt } from "./rot13";

describe("ROT13", () => {
  it("rotates letters only", async () => {
    expect((await encrypt("Hello, World!")).output).toBe("Uryyb, Jbeyq!");
  });

  it("is its own inverse", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });
});
