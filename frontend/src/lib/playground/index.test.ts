import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "./index";

describe("ALGORITHMS", () => {
  it("lists the seven algorithms in order", () => {
    expect(ALGORITHMS.map((a) => a.name)).toEqual([
      "AES-256-GCM",
      "AES-256-CBC",
      "RSA-OAEP",
      "SHA-256",
      "Base64",
      "Cifra de César",
      "Cifra de Vigenère",
    ]);
  });

  it("sets type and safety", () => {
    expect(ALGORITHMS.map((a) => [a.name, a.kind, a.safety])).toEqual([
      ["AES-256-GCM", "Criptografia simétrica", "Seguro"],
      ["AES-256-CBC", "Criptografia simétrica", "Seguro"],
      ["RSA-OAEP", "Criptografia assimétrica", "Seguro"],
      ["SHA-256", "Hash", "Não é criptografia"],
      ["Base64", "Codificação", "Não é criptografia"],
      ["Cifra de César", "Cifra clássica", "Inseguro"],
      ["Cifra de Vigenère", "Cifra clássica", "Inseguro"],
    ]);
  });

  it("explains each algorithm in at least two sentences", () => {
    for (const algorithm of ALGORITHMS) {
      const sentences = algorithm.summary.join(" ").match(/[^.]+\./g) ?? [];
      expect(sentences.length, algorithm.name).toBeGreaterThanOrEqual(2);
    }
  });

  it("names AES-256-GCM as the site algorithm", () => {
    const aes = ALGORITHMS.find((a) => a.name === "AES-256-GCM");
    expect(aes).toBeDefined();
    expect(aes!.summary.join(" ")).toContain("Nota Segura - BR");
  });

  it("says that RSA signatures use PSS", () => {
    const rsa = ALGORITHMS.find((a) => a.name === "RSA-OAEP");
    expect(rsa).toBeDefined();
    const text = rsa!.summary.join(" ");
    expect(text).toContain("PSS");
    expect(text).not.toContain("É usada para trocar chaves e assinar dados");
  });
});
