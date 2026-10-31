import { equalBytes, toBase64, utf8Decode, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { randomBytes } from "./web-crypto";

// RFC 8439. Demonstration code: the notes are encrypted by the backend with AES-256-GCM.
const KEY_BYTES = 32;
const NONCE_BYTES = 12;
const TAG_BYTES = 16;
const SIGMA = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];

function rotl(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n));
}

function quarterRound(s: Uint32Array, a: number, b: number, c: number, d: number) {
  s[a] += s[b];
  s[d] = rotl(s[d] ^ s[a], 16);
  s[c] += s[d];
  s[b] = rotl(s[b] ^ s[c], 12);
  s[a] += s[b];
  s[d] = rotl(s[d] ^ s[a], 8);
  s[c] += s[d];
  s[b] = rotl(s[b] ^ s[c], 7);
}

function chachaBlock(key: Uint8Array, counter: number, nonce: Uint8Array): Uint8Array {
  const keyView = new DataView(key.buffer, key.byteOffset, key.byteLength);
  const nonceView = new DataView(nonce.buffer, nonce.byteOffset, nonce.byteLength);
  const state = new Uint32Array(16);
  state.set(SIGMA);
  for (let i = 0; i < 8; i++) state[4 + i] = keyView.getUint32(i * 4, true);
  state[12] = counter;
  for (let i = 0; i < 3; i++) state[13 + i] = nonceView.getUint32(i * 4, true);

  const working = state.slice();
  for (let i = 0; i < 10; i++) {
    quarterRound(working, 0, 4, 8, 12);
    quarterRound(working, 1, 5, 9, 13);
    quarterRound(working, 2, 6, 10, 14);
    quarterRound(working, 3, 7, 11, 15);
    quarterRound(working, 0, 5, 10, 15);
    quarterRound(working, 1, 6, 11, 12);
    quarterRound(working, 2, 7, 8, 13);
    quarterRound(working, 3, 4, 9, 14);
  }

  const out = new Uint8Array(64);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 16; i++) outView.setUint32(i * 4, (working[i] + state[i]) >>> 0, true);
  return out;
}

function chacha20(key: Uint8Array, counter: number, nonce: Uint8Array, input: Uint8Array): Uint8Array {
  const out = new Uint8Array(input.length);
  for (let offset = 0; offset < input.length; offset += 64) {
    const block = chachaBlock(key, counter + offset / 64, nonce);
    const end = Math.min(offset + 64, input.length);
    for (let i = offset; i < end; i++) out[i] = input[i] ^ block[i - offset];
  }
  return out;
}

function leToBigInt(bytes: Uint8Array): bigint {
  let n = BigInt(0);
  for (let i = bytes.length - 1; i >= 0; i--) n = (n << BigInt(8)) | BigInt(bytes[i]);
  return n;
}

function poly1305(message: Uint8Array, key: Uint8Array): Uint8Array {
  const clamp = BigInt("0x0ffffffc0ffffffc0ffffffc0fffffff");
  const r = leToBigInt(key.subarray(0, 16)) & clamp;
  const s = leToBigInt(key.subarray(16, 32));
  const p = (BigInt(1) << BigInt(130)) - BigInt(5);
  let acc = BigInt(0);
  for (let offset = 0; offset < message.length; offset += 16) {
    const block = message.subarray(offset, Math.min(offset + 16, message.length));
    const n = leToBigInt(block) + (BigInt(1) << BigInt(8 * block.length));
    acc = ((acc + n) * r) % p;
  }
  acc = (acc + s) & ((BigInt(1) << BigInt(128)) - BigInt(1));
  const tag = new Uint8Array(TAG_BYTES);
  for (let i = 0; i < TAG_BYTES; i++) {
    tag[i] = Number(acc & BigInt(0xff));
    acc >>= BigInt(8);
  }
  return tag;
}

function pad16(length: number): Uint8Array {
  return new Uint8Array((16 - (length % 16)) % 16);
}

function le64(n: number): Uint8Array {
  const out = new Uint8Array(8);
  new DataView(out.buffer).setUint32(0, n, true);
  return out;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((sum, p) => sum + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function computeTag(key: Uint8Array, nonce: Uint8Array, ciphertext: Uint8Array, aad: Uint8Array): Uint8Array {
  const otk = chachaBlock(key, 0, nonce).subarray(0, 32);
  const macData = concat(aad, pad16(aad.length), ciphertext, pad16(ciphertext.length), le64(aad.length), le64(ciphertext.length));
  return poly1305(macData, otk);
}

export function chacha20Poly1305Seal(
  key: Uint8Array,
  nonce: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array = new Uint8Array(0),
): Uint8Array {
  const ciphertext = chacha20(key, 1, nonce, plaintext);
  return concat(ciphertext, computeTag(key, nonce, ciphertext, aad));
}

export function chacha20Poly1305Open(
  key: Uint8Array,
  nonce: Uint8Array,
  sealed: Uint8Array,
  aad: Uint8Array = new Uint8Array(0),
): Uint8Array {
  if (sealed.length < TAG_BYTES) throw new Error("Invalid ciphertext");
  const ciphertext = sealed.subarray(0, sealed.length - TAG_BYTES);
  const tag = sealed.subarray(sealed.length - TAG_BYTES);
  if (!equalBytes(tag, computeTag(key, nonce, ciphertext, aad))) throw new Error("Invalid tag");
  return chacha20(key, 1, nonce, ciphertext);
}

export async function encrypt(text: string): Promise<EncryptResult> {
  const key = randomBytes(KEY_BYTES);
  const nonce = randomBytes(NONCE_BYTES);
  const sealed = chacha20Poly1305Seal(key, nonce, utf8Encode(text));
  return {
    output: toBase64(sealed),
    details: [
      { label: "Chave", value: toBase64(key) },
      { label: "Nonce", value: toBase64(nonce) },
    ],
    decrypt: async () => utf8Decode(chacha20Poly1305Open(key, nonce, sealed)),
  };
}
