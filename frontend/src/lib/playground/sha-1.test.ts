// @vitest-environment node
import { describe, expect, it } from "vitest";
import { encrypt } from "./sha-1";

describe("SHA-1", () => {
  it("hashes abc", async () => {
    expect((await encrypt("abc")).output).toBe("a9993e364706816aba3e25717850c26c9cd0d89d");
  });

  it("has no way back", async () => {
    const result = await encrypt("abc");
    expect(result.decrypt).toBeUndefined();
    expect(result.verify).toBeUndefined();
    expect(result.details).toEqual([]);
  });
});
