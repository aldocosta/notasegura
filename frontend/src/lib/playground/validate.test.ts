import { describe, expect, it } from "vitest";
import { validateInput } from "./validate";

describe("validateInput", () => {
  it("rejects empty text", () => {
    expect(typeof validateInput("aes-gcm", "", {})).toBe("string");
  });

  it("asks for a password for PBKDF2", () => {
    expect(validateInput("pbkdf2", "", {})).toBe("Escreva uma senha.");
    expect(validateInput("sha-1", "", {})).toBe("Escreva um texto.");
  });

  it("rejects text over 500 characters", () => {
    expect(typeof validateInput("aes-gcm", "a".repeat(501), {})).toBe("string");
    expect(validateInput("aes-gcm", "a".repeat(500), {})).toBeNull();
  });

  it("limits RSA to 190 bytes", () => {
    expect(validateInput("rsa-oaep", "a".repeat(190), {})).toBeNull();
    expect(validateInput("rsa-oaep", "a".repeat(191), {})).toContain("190 bytes");
    expect(typeof validateInput("rsa-oaep", "á".repeat(96), {})).toBe("string");
  });

  it("validates the Vigenère keyword", () => {
    expect(validateInput("vigenere", "texto", { keyword: "chave" })).toBeNull();
    expect(typeof validateInput("vigenere", "texto", { keyword: "" })).toBe("string");
    expect(typeof validateInput("vigenere", "texto", { keyword: "chave1" })).toBe("string");
  });

  it("validates the César shift", () => {
    expect(validateInput("cesar", "texto", { shift: 1 })).toBeNull();
    expect(validateInput("cesar", "texto", { shift: 25 })).toBeNull();
    for (const shift of [0, 26, 2.5]) {
      expect(typeof validateInput("cesar", "texto", { shift }), String(shift)).toBe("string");
    }
  });
});
