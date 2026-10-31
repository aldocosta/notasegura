import { describe, expect, it } from "vitest";
import { fromBase64, toBase64, utf8Decode, utf8Encode } from "./bytes";

describe("playground bytes", () => {
  it("round-trips UTF-8 through Base64", () => {
    const text = "Olá, mundo! 123";
    expect(utf8Decode(fromBase64(toBase64(utf8Encode(text))))).toBe(text);
    expect(toBase64(utf8Encode("olá"))).toBe("b2zDoQ==");
  });
});
