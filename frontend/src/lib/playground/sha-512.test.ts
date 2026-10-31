// @vitest-environment node
import { describe, expect, it } from "vitest";
import { encrypt } from "./sha-512";

describe("SHA-512", () => {
  it("hashes abc", async () => {
    expect((await encrypt("abc")).output).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    );
  });

  it("has no way back", async () => {
    const result = await encrypt("abc");
    expect(result.decrypt).toBeUndefined();
    expect(result.verify).toBeUndefined();
    expect(result.details).toEqual([]);
  });
});
