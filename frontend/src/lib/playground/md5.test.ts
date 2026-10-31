// @vitest-environment node
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { utf8Encode } from "./bytes";
import { encrypt, md5Hex } from "./md5";

describe("MD5", () => {
  it("matches RFC 1321", () => {
    expect(md5Hex(utf8Encode(""))).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(md5Hex(utf8Encode("abc"))).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(md5Hex(utf8Encode("message digest"))).toBe("f96b697d7cb7938d525a2f31aaf161d0");
  });

  it("hashes UTF-8 and long input", async () => {
    expect((await encrypt("olá")).output).toMatch(/^[0-9a-f]{32}$/);
    const long = Uint8Array.from({ length: 1000 }, (_, i) => i % 251);
    expect(md5Hex(long)).toBe(createHash("md5").update(long).digest("hex"));
  });

  it("has no way back", async () => {
    const result = await encrypt("abc");
    expect(result.decrypt).toBeUndefined();
    expect(result.verify).toBeUndefined();
  });
});
