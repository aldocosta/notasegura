import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/lib/playground";
import type { AlgorithmId } from "@/lib/playground/types";
import { ARTICLES, algorithmHref, articleText, articleTitle, articleWordCount, findAlgorithm } from "./index";
import { ARTICLE_SECTION_TITLES, type Article } from "./types";

const IDS = ALGORITHMS.map((a) => a.id);

const REQUIRED_TERMS: Record<AlgorithmId, string[]> = {
  "aes-gcm": ["FIPS 197", "128 bits", "tag", "IV", "TLS 1.3", "scrypt", "Nota Segura - BR"],
  "aes-cbc": ["IV", "PKCS#7", "padding oracle", "HMAC", "TLS 1.3", "GCM"],
  "rsa-oaep": ["1977", "chave pública", "chave privada", "190 bytes", "AES", "PSS", "Shor"],
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
});

describe("article helpers", () => {
  it("builds the title and the href", () => {
    expect(articleTitle(ALGORITHMS[0])).toBe("AES-256-GCM: o que é e como funciona");
    expect(algorithmHref("cesar")).toBe("/algoritmos/cesar");
  });

  it("finds only known algorithms", () => {
    expect(findAlgorithm("cesar")?.name).toBe("Cifra de César");
    expect(findAlgorithm("rot13")).toBeUndefined();
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
