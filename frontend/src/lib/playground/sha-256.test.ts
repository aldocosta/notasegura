// @vitest-environment node
import { describe, expect, it } from "vitest";
import { encrypt } from "./sha-256";

describe("SHA-256", () => {
  it("hashes abc", async () => {
    expect((await encrypt("abc")).output).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("has no decrypt", async () => {
    const result = await encrypt("abc");
    expect(result.decrypt).toBeUndefined();
    expect(result.details).toEqual([]);
  });
});
