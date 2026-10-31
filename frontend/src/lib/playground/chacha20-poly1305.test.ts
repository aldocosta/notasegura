// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64, toHex, utf8Decode, utf8Encode } from "./bytes";
import { chacha20Poly1305Open, chacha20Poly1305Seal, encrypt } from "./chacha20-poly1305";
import type { EncryptResult } from "./types";

function hex(value: string): Uint8Array {
  return Uint8Array.from(value.match(/../g)!, (byte) => parseInt(byte, 16));
}

function detail(result: EncryptResult, label: string): string {
  const found = result.details.find((d) => d.label === label);
  expect(found, label).toBeDefined();
  return found!.value;
}

const KEY = hex("808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f");
const NONCE = hex("070000004041424344454647");
const AAD = hex("50515253c0c1c2c3c4c5c6c7");
const PLAINTEXT = utf8Encode(
  "Ladies and Gentlemen of the class of '99: If I could offer you only one tip for the future, sunscreen would be it.",
);
const CIPHERTEXT =
  "d31a8d34648e60db7b86afbc53ef7ec2a4aded51296e08fea9e2b5a736ee62d63dbea45e8ca9671282fafb69da92728b1a71de0a9e060b2905d6a5b67ecd3b3692ddbd7f2d778b8c9803aee328091b58fab324e4fad675945585808b4831d7bc3ff4def08e4b7a9de576d26586cec64b6116";
const TAG = "1ae10b594f09e26a7e902ecbd0600691";

describe("ChaCha20-Poly1305", () => {
  it("matches RFC 8439 section 2.8.2", () => {
    const sealed = chacha20Poly1305Seal(KEY, NONCE, PLAINTEXT, AAD);
    expect(toHex(sealed.subarray(0, PLAINTEXT.length))).toBe(CIPHERTEXT);
    expect(toHex(sealed.subarray(PLAINTEXT.length))).toBe(TAG);
  });

  it("opens what it seals", () => {
    const sealed = chacha20Poly1305Seal(KEY, NONCE, PLAINTEXT, AAD);
    expect(utf8Decode(chacha20Poly1305Open(KEY, NONCE, sealed, AAD))).toBe(utf8Decode(PLAINTEXT));
  });

  it("rejects a changed byte", () => {
    const sealed = chacha20Poly1305Seal(KEY, NONCE, PLAINTEXT, AAD);
    sealed[10] ^= 1;
    expect(() => chacha20Poly1305Open(KEY, NONCE, sealed, AAD)).toThrow();
  });

  it("round-trips through the playground", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
    expect(fromBase64(detail(result, "Chave"))).toHaveLength(32);
    expect(fromBase64(detail(result, "Nonce"))).toHaveLength(12);
    expect(fromBase64((await encrypt("segredo")).output)).toHaveLength(23);
  });
});
