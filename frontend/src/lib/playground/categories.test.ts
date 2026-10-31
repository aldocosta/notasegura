import { describe, expect, it } from "vitest";
import { algorithmsByCategory } from "./categories";
import { ALGORITHMS } from "./index";

describe("algorithmsByCategory", () => {
  it("groups by category in order", () => {
    expect(algorithmsByCategory().map((c) => [c.name, c.algorithms.map((a) => a.name)])).toEqual([
      ["Criptografia", ["AES-256-GCM", "ChaCha20-Poly1305", "AES-256-CBC", "AES-256-CTR", "RSA-OAEP"]],
      ["Hash", ["SHA-256", "SHA-512", "SHA-1", "MD5"]],
      ["Autenticação e assinatura", ["HMAC-SHA-256", "ECDSA", "Ed25519", "RSA-PSS"]],
      ["Troca e derivação de chaves", ["ECDH", "PBKDF2"]],
      ["Codificação", ["Base64"]],
      ["Cifras clássicas", ["Cifra de César", "Cifra de Vigenère"]],
    ]);
  });

  it("covers every algorithm once", () => {
    const ids = algorithmsByCategory().flatMap((c) => c.algorithms.map((a) => a.id));
    expect(ids).toEqual(ALGORITHMS.map((a) => a.id));
  });
});
