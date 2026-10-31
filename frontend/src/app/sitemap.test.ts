// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "./sitemap";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://notasegura.example");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("lists the home, the trust pages, the algorithm pages, and the guides", () => {
    expect(sitemap().map((e) => e.url)).toEqual([
      "https://notasegura.example",
      "https://notasegura.example/sobre",
      "https://notasegura.example/privacidade",
      "https://notasegura.example/contato",
      "https://notasegura.example/algoritmos",
      "https://notasegura.example/algoritmos/aes-gcm",
      "https://notasegura.example/algoritmos/chacha20-poly1305",
      "https://notasegura.example/algoritmos/aes-cbc",
      "https://notasegura.example/algoritmos/aes-ctr",
      "https://notasegura.example/algoritmos/rsa-oaep",
      "https://notasegura.example/algoritmos/sha-256",
      "https://notasegura.example/algoritmos/sha-512",
      "https://notasegura.example/algoritmos/sha-1",
      "https://notasegura.example/algoritmos/md5",
      "https://notasegura.example/algoritmos/hmac-sha-256",
      "https://notasegura.example/algoritmos/ecdsa",
      "https://notasegura.example/algoritmos/ed25519",
      "https://notasegura.example/algoritmos/rsa-pss",
      "https://notasegura.example/algoritmos/ecdh",
      "https://notasegura.example/algoritmos/pbkdf2",
      "https://notasegura.example/algoritmos/base64",
      "https://notasegura.example/algoritmos/hex",
      "https://notasegura.example/algoritmos/cesar",
      "https://notasegura.example/algoritmos/rot13",
      "https://notasegura.example/algoritmos/atbash",
      "https://notasegura.example/algoritmos/vigenere",
      "https://notasegura.example/algoritmos/playfair",
      "https://notasegura.example/algoritmos/rail-fence",
      "https://notasegura.example/algoritmos/enigma",
      "https://notasegura.example/algoritmos/vernam",
      "https://notasegura.example/guias",
      "https://notasegura.example/guias/aes-gcm-ou-chacha20-poly1305",
      "https://notasegura.example/guias/sha-256-sha-1-ou-md5",
      "https://notasegura.example/guias/criptografia-hash-ou-codificacao",
      "https://notasegura.example/guias/rsa-ou-curvas-elipticas",
      "https://notasegura.example/guias/como-enviar-uma-senha-com-seguranca",
      "https://notasegura.example/guias/o-que-e-uma-nota-autodestrutiva",
      "https://notasegura.example/guias/o-que-e-criptografia-de-ponta-a-ponta",
      "https://notasegura.example/guias/como-guardar-senhas",
    ]);
    expect(sitemap()).toHaveLength(39);
    for (const entry of sitemap()) {
      expect(entry.url).not.toContain("/termos");
    }
  });

  it("lists no note URL", () => {
    for (const entry of sitemap()) {
      expect(entry.url).not.toContain("/n/");
    }
  });
});
