// @vitest-environment node
import { describe, expect, it } from "vitest";
import { fromBase64, toHex, utf8Encode } from "./bytes";
import { encrypt, pbkdf2Sha256 } from "./pbkdf2";
import type { EncryptResult } from "./types";

function detail(result: EncryptResult, label: string): string {
  const found = result.details.find((d) => d.label === label);
  expect(found, label).toBeDefined();
  return found!.value;
}

describe("PBKDF2", () => {
  it("matches the known vector", async () => {
    expect(toHex(await pbkdf2Sha256("password", utf8Encode("salt"), 1, 32))).toBe(
      "120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b",
    );
  });

  it("uses 600000 iterations and a 16-byte salt", async () => {
    const result = await encrypt("senha123");
    expect(detail(result, "Iterações")).toBe("600000");
    expect(fromBase64(detail(result, "Sal"))).toHaveLength(16);
    expect(fromBase64(result.output)).toHaveLength(32);
  });

  it("verifies the same password only", async () => {
    const result = await encrypt("senha123");
    expect(await result.verify!("senha123")).toBe(true);
    expect(await result.verify!("senha124")).toBe(false);
    expect(result.decrypt).toBeUndefined();
  });

  it("uses a new salt each time", async () => {
    const first = await encrypt("senha");
    const second = await encrypt("senha");
    expect(second.output).not.toBe(first.output);
  });
});
