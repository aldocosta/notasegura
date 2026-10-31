import { describe, expect, it } from "vitest";
import { encrypt } from "./base64";

describe("Base64", () => {
  it("encodes UTF-8 text", async () => {
    const result = await encrypt("olá");
    expect(result.output).toBe("b2zDoQ==");
    expect(result.details).toEqual([]);
  });

  it("decodes back to the text", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });
});
