import { ALGORITHMS } from "@/lib/playground";
import type { Algorithm, AlgorithmId } from "@/lib/playground/types";
import { aesCbc } from "./articles/aes-cbc";
import { aesGcm } from "./articles/aes-gcm";
import { base64 } from "./articles/base64";
import { cesar } from "./articles/cesar";
import { rsaOaep } from "./articles/rsa-oaep";
import { sha256 } from "./articles/sha-256";
import { vigenere } from "./articles/vigenere";
import type { Article } from "./types";

export { algorithmHref } from "./href";

export const ARTICLES: Record<AlgorithmId, Article> = {
  "aes-gcm": aesGcm,
  "aes-cbc": aesCbc,
  "rsa-oaep": rsaOaep,
  "sha-256": sha256,
  base64,
  cesar,
  vigenere,
};

export function findAlgorithm(id: string): Algorithm | undefined {
  return ALGORITHMS.find((a) => a.id === id);
}

export function articleTitle(algorithm: Pick<Algorithm, "name">): string {
  return `${algorithm.name}: o que é e como funciona`;
}

export function articleText(article: Article): string[] {
  const { kind, safety, key } = article.highlights;
  return [
    article.lead,
    kind,
    safety,
    key,
    ...article.sections.flatMap((s) => [...s.paragraphs, ...(s.items ?? [])]),
  ];
}

export function articleWordCount(article: Article): number {
  return articleText(article).reduce((total, text) => total + text.split(/\s+/).filter(Boolean).length, 0);
}
