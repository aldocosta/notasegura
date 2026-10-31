import { describe, expect, it } from "vitest";
import { encrypt } from "./hex";

describe("Hexadecimal", () => {
  it("encodes UTF-8", async () => {
    expect((await encrypt("olá")).output).toBe("6f6cc3a1");
  });

  it("decodes back", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });
});
