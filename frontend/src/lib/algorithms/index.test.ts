import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/lib/playground";
import type { AlgorithmId } from "@/lib/playground/types";
import { ARTICLES, algorithmHref, articleText, articleTitle, articleWordCount, findAlgorithm } from "./index";
import { ARTICLE_SECTION_TITLES, type Article } from "./types";

const IDS = ALGORITHMS.map((a) => a.id);

const REQUIRED_TERMS: Record<AlgorithmId, string[]> = {
  "aes-gcm": ["FIPS 197", "128 bits", "tag", "IV", "TLS 1.3", "scrypt", "Nota Segura - BR"],
  "chacha20-poly1305": ["Bernstein", "RFC 8439", "256 bits", "12 bytes", "WireGuard", "TLS 1.3", "nonce"],
  "aes-cbc": ["IV", "PKCS#7", "padding oracle", "HMAC", "TLS 1.3", "GCM"],
  "aes-ctr": ["contador", "XOR", "16 bytes", "mesmo tamanho", "GCM", "HMAC"],
  "rsa-oaep": ["1977", "chave pública", "chave privada", "190 bytes", "AES", "PSS", "Shor"],
  "sha-512": [
    "FIPS 180-4",
    "128",
    "80",
    "Ed25519",
    "$6$",
    "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
  ],
  "sha-1": ["160 bits", "40", "a9993e364706816aba3e25717850c26c9cd0d89d", "SHAttered", "2017", "Git"],
  md5: ["Rivest", "RFC 1321", "128 bits", "32", "900150983cd24fb0d6963f7d28e17f72", "colisão", "Flame"],
  "hmac-sha-256": [
    "RFC 2104",
    "chave secreta",
    "Jefe",
    "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
    "JWT",
    "webhook",
    "tempo constante",
  ],
  pbkdf2: [
    "RFC 8018",
    "sal",
    "600.000",
    "120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b",
    "WPA2",
    "Django",
    "Argon2",
  ],
  ecdsa: ["curvas elípticas", "P-256", "64 bytes", "chave privada", "PlayStation 3", "WebAuthn", "Bitcoin"],
  ed25519: ["Bernstein", "RFC 8032", "32 bytes", "64 bytes", "determinística", "SHA-512", "SSH"],
  "rsa-pss": ["Bellare", "Rogaway", "RFC 8017", "sal", "256 bytes", "TLS 1.3", "PKCS#1 v1.5"],
  ecdh: ["Diffie", "Hellman", "1976", "segredo compartilhado", "homem no meio", "sigilo futuro", "TLS 1.3"],
  "sha-256": [
    "FIPS 180-4",
    "64",
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    "HMAC",
    "Argon2",
    "Bitcoin",
  ],
  base64: ["RFC 4648", "33%", "b2zDoQ==", "MIME", "JWT", "Base64url"],
  cesar: ["Júlio César", "Suetônio", "25", "Def, abc!", "ROT13", "Al-Kindi"],
  vigenere: ["Bellaso", "1553", "LXFOPVEFRNHR", "Kasiski", "índice de coincidência", "one-time pad"],
  hex: ["16", "0 a 9", "dobro", "6f6cc3a1", "hash", "CSS", "#ff0000"],
  rot13: ["César", "13", "duas vezes", "Uryyb", "Usenet"],
  atbash: ["hebraico", "Jeremias", "substituição", "sem chave", "Zyx, cba!"],
  playfair: ["Wheatstone", "1854", "5x5", "pares", "BMODZBXDNABEKUDMUIXMMOUVIF", "Kennedy"],
  "rail-fence": ["transposição", "zigue-zague", "trilhos", "WECRLTEERDSOEEFEAOCAIVDEN", "frequência"],
  enigma: ["Scherbius", "rotores", "refletor", "nunca", "Rejewski", "Turing", "Bletchley Park", "BDZGO"],
  vernam: ["1917", "XOR", "uma única vez", "Shannon", "sigilo perfeito", "Venona"],
};

describe("ARTICLES", () => {
  it("has one article per algorithm", () => {
    expect(Object.keys(ARTICLES).sort()).toEqual([...IDS].sort());
    for (const id of IDS) {
      expect(ARTICLES[id].id).toBe(id);
    }
  });

  it("uses the six sections in order", () => {
    for (const id of IDS) {
      const { sections } = ARTICLES[id];
      expect(sections.map((s) => s.title), id).toEqual([...ARTICLE_SECTION_TITLES]);
      for (const section of sections) {
        expect(section.paragraphs.length, `${id} ${section.title}`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("has 450 to 1100 words", () => {
    for (const id of IDS) {
      const count = articleWordCount(ARTICLES[id]);
      expect(count, id).toBeGreaterThanOrEqual(450);
      expect(count, id).toBeLessThanOrEqual(1100);
    }
  });

  it("has a meta description of 70 to 160 characters", () => {
    for (const id of IDS) {
      const { length } = ARTICLES[id].description;
      expect(length, id).toBeGreaterThanOrEqual(70);
      expect(length, id).toBeLessThanOrEqual(160);
    }
  });

  it("links two other algorithms", () => {
    for (const id of IDS) {
      const { related } = ARTICLES[id];
      expect(related, id).toHaveLength(2);
      expect(new Set(related).size, id).toBe(2);
      for (const other of related) {
        expect(IDS, id).toContain(other);
        expect(other, id).not.toBe(id);
      }
    }
  });

  it.each(IDS)("states the required facts of %s", (id) => {
    const text = articleText(ARTICLES[id]).join(" ");
    for (const term of REQUIRED_TERMS[id]) {
      expect(text, term).toContain(term);
    }
  });

  it("matches the Enigma example", () => {
    const section = ARTICLES.enigma.sections.find((s) => s.title === "O que é")!;
    const text = section.paragraphs.join(" ");
    expect(text).toContain("D na segunda");
    expect(text).not.toContain("Z na segunda");
  });
});

describe("article helpers", () => {
  it("builds the title and the href", () => {
    expect(articleTitle(ALGORITHMS[0])).toBe("AES-256-GCM: o que é e como funciona");
    expect(algorithmHref("cesar")).toBe("/algoritmos/cesar");
  });

  it("finds only known algorithms", () => {
    expect(findAlgorithm("cesar")?.name).toBe("Cifra de César");
    expect(findAlgorithm("rot47")).toBeUndefined();
  });

  it("counts words", () => {
    const article: Article = {
      id: "cesar",
      description: "",
      lead: "um dois",
      highlights: { kind: "três", safety: "quatro", key: "cinco" },
      sections: [{ title: "O que é", paragraphs: ["seis  sete"] }],
      related: ["vigenere", "base64"],
    };
    expect(articleWordCount(article)).toBe(7);
  });
});
