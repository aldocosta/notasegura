// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { fromBase64 } from "./bytes";
import * as ecdsa from "./ecdsa";
import * as ed25519 from "./ed25519";
import * as rsaPss from "./rsa-pss";
import { AlgorithmUnsupportedError } from "./web-crypto";

const SIGNATURES = [
  { name: "ECDSA", module: ecdsa, signatureBytes: 64 },
  { name: "Ed25519", module: ed25519, signatureBytes: 64 },
  { name: "RSA-PSS", module: rsaPss, signatureBytes: 256 },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each(SIGNATURES)("$name", ({ module, signatureBytes }) => {
  it("verifies the same text only", async () => {
    const result = await module.encrypt("segredo");
    expect(await result.verify!("segredo")).toBe(true);
    expect(await result.verify!("segredO")).toBe(false);
  });

  it("has the expected signature size", async () => {
    expect(fromBase64((await module.encrypt("segredo")).output)).toHaveLength(signatureBytes);
  });

  it("shows only the public key", async () => {
    const result = await module.encrypt("segredo");
    expect(result.details).toHaveLength(1);
    expect(result.details[0].label).toBe("Chave pública");
    for (const d of result.details) {
      expect(d.label.toLowerCase()).not.toContain("privada");
    }
  });

  it("has no decrypt", async () => {
    expect((await module.encrypt("segredo")).decrypt).toBeUndefined();
  });
});

describe("Ed25519 key", () => {
  it("shows a 32-byte public key", async () => {
    const result = await ed25519.encrypt("segredo");
    expect(fromBase64(result.details[0].value)).toHaveLength(32);
  });

  it("reports an unsupported browser", async () => {
    vi.spyOn(globalThis.crypto.subtle, "generateKey").mockRejectedValue(new DOMException("x", "NotSupportedError"));
    await expect(ed25519.encrypt("segredo")).rejects.toBeInstanceOf(AlgorithmUnsupportedError);
  });
});
