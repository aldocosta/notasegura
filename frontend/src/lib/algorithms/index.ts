import { ALGORITHMS } from "@/lib/playground";
import type { Algorithm, AlgorithmId } from "@/lib/playground/types";
import { aesCbc } from "./articles/aes-cbc";
import { aesCtr } from "./articles/aes-ctr";
import { aesGcm } from "./articles/aes-gcm";
import { atbash } from "./articles/atbash";
import { base64 } from "./articles/base64";
import { cesar } from "./articles/cesar";
import { chacha20Poly1305 } from "./articles/chacha20-poly1305";
import { ecdh } from "./articles/ecdh";
import { ecdsa } from "./articles/ecdsa";
import { ed25519 } from "./articles/ed25519";
import { enigma } from "./articles/enigma";
import { hex } from "./articles/hex";
import { hmacSha256 } from "./articles/hmac-sha-256";
import { md5 } from "./articles/md5";
import { pbkdf2 } from "./articles/pbkdf2";
import { playfair } from "./articles/playfair";
import { railFence } from "./articles/rail-fence";
import { rot13 } from "./articles/rot13";
import { rsaOaep } from "./articles/rsa-oaep";
import { rsaPss } from "./articles/rsa-pss";
import { sha1 } from "./articles/sha-1";
import { sha256 } from "./articles/sha-256";
import { sha512 } from "./articles/sha-512";
import { vernam } from "./articles/vernam";
import { vigenere } from "./articles/vigenere";
import type { Article } from "./types";

export { algorithmHref } from "./href";

export const ARTICLES: Record<AlgorithmId, Article> = {
  "aes-gcm": aesGcm,
  "chacha20-poly1305": chacha20Poly1305,
  "aes-cbc": aesCbc,
  "aes-ctr": aesCtr,
  "rsa-oaep": rsaOaep,
  "sha-256": sha256,
  "sha-512": sha512,
  "sha-1": sha1,
  md5,
  "hmac-sha-256": hmacSha256,
  ecdsa,
  ed25519,
  "rsa-pss": rsaPss,
  ecdh,
  pbkdf2,
  base64,
  hex,
  cesar,
  rot13,
  atbash,
  vigenere,
  playfair,
  "rail-fence": railFence,
  enigma,
  vernam,
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
