import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "@/lib/playground";
import type { AlgorithmId } from "@/lib/playground/types";
import { GUIDES, findGuide, guideHref, guideText, guideWordCount, guidesFor } from "./index";
import { COMPARISON_SECTION_TITLES } from "./types";

const SLUGS = [
  "aes-gcm-ou-chacha20-poly1305",
  "sha-256-sha-1-ou-md5",
  "criptografia-hash-ou-codificacao",
  "rsa-ou-curvas-elipticas",
  "como-enviar-uma-senha-com-seguranca",
  "o-que-e-uma-nota-autodestrutiva",
  "o-que-e-criptografia-de-ponta-a-ponta",
  "como-guardar-senhas",
];

const COMPARISON_COLUMNS: Record<string, string[]> = {
  "aes-gcm-ou-chacha20-poly1305": ["Critério", "AES-256-GCM", "ChaCha20-Poly1305"],
  "sha-256-sha-1-ou-md5": ["Critério", "MD5", "SHA-1", "SHA-256"],
  "criptografia-hash-ou-codificacao": ["Critério", "Criptografia", "Hash", "Codificação"],
  "rsa-ou-curvas-elipticas": ["Critério", "RSA", "Curvas elípticas"],
};

const CITED: Record<string, AlgorithmId[]> = {
  "aes-gcm-ou-chacha20-poly1305": ["aes-gcm", "chacha20-poly1305", "aes-cbc"],
  "sha-256-sha-1-ou-md5": ["sha-256", "sha-1", "md5", "sha-512", "hmac-sha-256"],
  "criptografia-hash-ou-codificacao": ["aes-gcm", "sha-256", "base64", "hex", "hmac-sha-256"],
  "rsa-ou-curvas-elipticas": ["rsa-oaep", "rsa-pss", "ecdsa", "ed25519", "ecdh"],
  "como-enviar-uma-senha-com-seguranca": ["aes-gcm", "pbkdf2"],
  "o-que-e-uma-nota-autodestrutiva": ["aes-gcm", "pbkdf2"],
  "o-que-e-criptografia-de-ponta-a-ponta": ["ecdh", "aes-gcm", "ed25519"],
  "como-guardar-senhas": ["pbkdf2", "sha-256", "md5", "sha-1"],
};

const RELATED: Record<string, [string, string]> = {
  "aes-gcm-ou-chacha20-poly1305": ["criptografia-hash-ou-codificacao", "rsa-ou-curvas-elipticas"],
  "sha-256-sha-1-ou-md5": ["criptografia-hash-ou-codificacao", "como-guardar-senhas"],
  "criptografia-hash-ou-codificacao": ["sha-256-sha-1-ou-md5", "aes-gcm-ou-chacha20-poly1305"],
  "rsa-ou-curvas-elipticas": ["aes-gcm-ou-chacha20-poly1305", "o-que-e-criptografia-de-ponta-a-ponta"],
  "como-enviar-uma-senha-com-seguranca": ["o-que-e-uma-nota-autodestrutiva", "o-que-e-criptografia-de-ponta-a-ponta"],
  "o-que-e-uma-nota-autodestrutiva": ["como-enviar-uma-senha-com-seguranca", "o-que-e-criptografia-de-ponta-a-ponta"],
  "o-que-e-criptografia-de-ponta-a-ponta": ["como-enviar-uma-senha-com-seguranca", "rsa-ou-curvas-elipticas"],
  "como-guardar-senhas": ["sha-256-sha-1-ou-md5", "criptografia-hash-ou-codificacao"],
};

const REQUIRED_TERMS: Record<string, string[]> = {
  "aes-gcm-ou-chacha20-poly1305": [
    "AEAD",
    "12 bytes",
    "16 bytes",
    "AES-NI",
    "tempo constante",
    "TLS 1.3",
    "WireGuard",
    "XChaCha20",
    "Nota Segura - BR",
  ],
  "sha-256-sha-1-ou-md5": [
    "128 bits",
    "160 bits",
    "256 bits",
    "colisão",
    "Flame",
    "SHAttered",
    "Git",
    "900150983cd24fb0d6963f7d28e17f72",
    "a9993e364706816aba3e25717850c26c9cd0d89d",
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    "Argon2",
  ],
  "criptografia-hash-ou-codificacao": ["chave", "AES-256-GCM", "mão única", "SHA-256", "Base64", "b2zDoQ==", "6f6cc3a1", "HMAC"],
  "rsa-ou-curvas-elipticas": ["2048 bits", "3072 bits", "P-256", "Ed25519", "32 bytes", "64 bytes", "Shor", "ML-KEM", "FIPS 203"],
  "como-enviar-uma-senha-com-seguranca": [
    "histórico",
    "1 a 30 dias",
    "1 a 50",
    "AES-256-GCM",
    "frase secreta",
    "outro canal",
    "gerenciador de senhas",
  ],
  "o-que-e-uma-nota-autodestrutiva": [
    "1 a 30 dias",
    "1 a 50",
    "sem conta",
    "AES-256-GCM",
    "frase secreta",
    "scrypt",
    "captura de tela",
  ],
  "o-que-e-criptografia-de-ponta-a-ponta": ["ponta a ponta", "TLS", "Signal", "ECDH", "2016", "metadados", "Nota Segura - BR"],
  "como-guardar-senhas": ["SHA-1", "sal", "tabelas arco-íris", "Argon2id", "bcrypt", "scrypt", "600.000", "LinkedIn"],
};

const COMPARISONS = GUIDES.filter((g) => g.kind === "Comparação");
const PRACTICAL = GUIDES.filter((g) => g.kind === "Guia prático");

describe("GUIDES", () => {
  it("lists the eight guides in order", () => {
    expect(GUIDES.map((g) => g.slug)).toEqual(SLUGS);
    expect(COMPARISONS).toHaveLength(4);
    expect(PRACTICAL).toHaveLength(4);
  });

  it("has unique kebab-case slugs", () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    for (const { slug } of GUIDES) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("has a title of 30 to 70 characters and a description of 70 to 160 characters", () => {
    for (const guide of GUIDES) {
      expect(guide.title.length, guide.slug).toBeGreaterThanOrEqual(30);
      expect(guide.title.length, guide.slug).toBeLessThanOrEqual(70);
      expect(guide.description.length, guide.slug).toBeGreaterThanOrEqual(70);
      expect(guide.description.length, guide.slug).toBeLessThanOrEqual(160);
    }
  });

  it("uses the comparison sections", () => {
    for (const guide of COMPARISONS) {
      expect(guide.sections.map((s) => s.title), guide.slug).toEqual([...COMPARISON_SECTION_TITLES]);
    }
  });

  it("has a valid comparison table", () => {
    for (const guide of COMPARISONS) {
      const table = guide.sections.find((s) => s.title === "Comparação lado a lado")?.table;
      expect(table, guide.slug).toBeDefined();
      expect(table!.caption.trim().length, guide.slug).toBeGreaterThan(0);
      expect(table!.columns.length, guide.slug).toBeGreaterThanOrEqual(3);
      expect(table!.columns[0], guide.slug).toBe("Critério");
      expect(table!.rows.length, guide.slug).toBeGreaterThanOrEqual(4);
      for (const row of table!.rows) {
        expect(row, `${guide.slug} ${row[0]}`).toHaveLength(table!.columns.length);
      }
      expect(table!.columns, guide.slug).toEqual(COMPARISON_COLUMNS[guide.slug]);
    }
  });

  it("uses four to eight sections in a practical guide", () => {
    for (const guide of PRACTICAL) {
      const titles = guide.sections.map((s) => s.title);
      expect(titles.length, guide.slug).toBeGreaterThanOrEqual(4);
      expect(titles.length, guide.slug).toBeLessThanOrEqual(8);
      expect(titles[0], guide.slug).toBe("Resumo");
      expect(new Set(titles).size, guide.slug).toBe(titles.length);
    }
  });

  it("has three highlights", () => {
    for (const guide of GUIDES) {
      expect(guide.highlights, guide.slug).toHaveLength(3);
      for (const highlight of guide.highlights) {
        expect(highlight.title.trim().length, guide.slug).toBeGreaterThan(0);
        expect(highlight.text.trim().length, guide.slug).toBeGreaterThan(0);
      }
    }
  });

  it("cites the algorithms of the design", () => {
    const ids = ALGORITHMS.map((a) => a.id);
    for (const guide of GUIDES) {
      expect(guide.algorithms, guide.slug).toEqual(CITED[guide.slug]);
      expect(guide.algorithms.length, guide.slug).toBeGreaterThanOrEqual(2);
      expect(guide.algorithms.length, guide.slug).toBeLessThanOrEqual(6);
      expect(new Set(guide.algorithms).size, guide.slug).toBe(guide.algorithms.length);
      for (const id of guide.algorithms) {
        expect(ids, guide.slug).toContain(id);
      }
    }
  });

  it("relates two other guides", () => {
    for (const guide of GUIDES) {
      expect(guide.related, guide.slug).toEqual(RELATED[guide.slug]);
      for (const slug of guide.related) {
        expect(SLUGS, guide.slug).toContain(slug);
        expect(slug, guide.slug).not.toBe(guide.slug);
      }
    }
  });

  it("has 600 to 1400 words", () => {
    for (const guide of GUIDES) {
      const count = guideWordCount(guide);
      expect(count, guide.slug).toBeGreaterThanOrEqual(600);
      expect(count, guide.slug).toBeLessThanOrEqual(1400);
    }
  });

  it("states the required facts", () => {
    expect(Object.keys(REQUIRED_TERMS)).toEqual(SLUGS);
    for (const guide of GUIDES) {
      const text = guideText(guide).join(" ");
      for (const term of REQUIRED_TERMS[guide.slug]) {
        expect(text, `${guide.slug}: ${term}`).toContain(term);
      }
    }
  });

  it("states the corrected facts", () => {
    expect(guideText(findGuide("como-guardar-senhas")!).join(" ")).not.toContain(
      "Todas as opções abaixo já cuidam do sal",
    );
    const enviar = findGuide("como-enviar-uma-senha-com-seguranca")!;
    for (const text of [enviar.lead, ...enviar.highlights.flatMap((h) => [h.title, h.text])]) {
      expect(text).not.toContain("some depois");
    }
    expect(enviar.lead).toContain("deixa de abrir");
    expect(guideText(findGuide("rsa-ou-curvas-elipticas")!).join(" ")).toContain("FIPS 205");
  });

  it("has a publication date", () => {
    for (const guide of GUIDES) {
      expect(guide.publishedAt, guide.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("guide helpers", () => {
  it("finds the guides of an algorithm", () => {
    expect(guidesFor("aes-gcm").map((g) => g.slug)).toEqual([
      "aes-gcm-ou-chacha20-poly1305",
      "criptografia-hash-ou-codificacao",
      "como-enviar-uma-senha-com-seguranca",
    ]);
    expect(guidesFor("rot13")).toEqual([]);
    for (const { id } of ALGORITHMS) {
      expect(guidesFor(id).length, id).toBeLessThanOrEqual(3);
    }
  });

  it("finds only known guides", () => {
    expect(findGuide("nao-existe")).toBeUndefined();
    expect(guideHref("como-guardar-senhas")).toBe("/guias/como-guardar-senhas");
  });

  it("counts the table cells in the text", () => {
    const guide = findGuide("sha-256-sha-1-ou-md5")!;
    const table = guide.sections.find((s) => s.table)!.table!;
    const text = guideText(guide);
    expect(text).toContain(table.caption);
    for (const row of table.rows) {
      expect(text).toContain(row[0]);
    }
  });
});
