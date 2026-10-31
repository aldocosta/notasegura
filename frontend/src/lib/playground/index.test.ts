import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "./index";

describe("ALGORITHMS", () => {
  it("lists the twenty-five algorithms in order", () => {
    expect(ALGORITHMS.map((a) => a.name)).toEqual([
      "AES-256-GCM",
      "ChaCha20-Poly1305",
      "AES-256-CBC",
      "AES-256-CTR",
      "RSA-OAEP",
      "SHA-256",
      "SHA-512",
      "SHA-1",
      "MD5",
      "HMAC-SHA-256",
      "ECDSA",
      "Ed25519",
      "RSA-PSS",
      "ECDH",
      "PBKDF2",
      "Base64",
      "Hexadecimal",
      "Cifra de César",
      "ROT13",
      "Cifra Atbash",
      "Cifra de Vigenère",
      "Cifra de Playfair",
      "Cerca de trilho",
      "Máquina Enigma",
      "Cifra de Vernam",
    ]);
  });

  it("sets type and safety", () => {
    expect(ALGORITHMS.map((a) => [a.name, a.kind, a.safety])).toEqual([
      ["AES-256-GCM", "Criptografia simétrica", "Seguro"],
      ["ChaCha20-Poly1305", "Criptografia simétrica", "Seguro"],
      ["AES-256-CBC", "Criptografia simétrica", "Seguro"],
      ["AES-256-CTR", "Criptografia simétrica", "Seguro"],
      ["RSA-OAEP", "Criptografia assimétrica", "Seguro"],
      ["SHA-256", "Hash", "Não é criptografia"],
      ["SHA-512", "Hash", "Não é criptografia"],
      ["SHA-1", "Hash", "Inseguro"],
      ["MD5", "Hash", "Inseguro"],
      ["HMAC-SHA-256", "Autenticação de mensagem", "Seguro"],
      ["ECDSA", "Assinatura digital", "Seguro"],
      ["Ed25519", "Assinatura digital", "Seguro"],
      ["RSA-PSS", "Assinatura digital", "Seguro"],
      ["ECDH", "Troca de chaves", "Seguro"],
      ["PBKDF2", "Derivação de chave", "Seguro"],
      ["Base64", "Codificação", "Não é criptografia"],
      ["Hexadecimal", "Codificação", "Não é criptografia"],
      ["Cifra de César", "Cifra clássica", "Inseguro"],
      ["ROT13", "Cifra clássica", "Inseguro"],
      ["Cifra Atbash", "Cifra clássica", "Inseguro"],
      ["Cifra de Vigenère", "Cifra clássica", "Inseguro"],
      ["Cifra de Playfair", "Cifra clássica", "Inseguro"],
      ["Cerca de trilho", "Cifra clássica", "Inseguro"],
      ["Máquina Enigma", "Cifra clássica", "Inseguro"],
      ["Cifra de Vernam", "Cifra clássica", "Seguro"],
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
