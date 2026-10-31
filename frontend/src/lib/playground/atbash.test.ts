import { describe, expect, it } from "vitest";
import { encrypt } from "./atbash";

describe("Cifra Atbash", () => {
  it("mirrors the alphabet", async () => {
    expect((await encrypt("Abc, xyz!")).output).toBe("Zyx, cba!");
  });

  it("decrypts back", async () => {
    const result = await encrypt("Olá, mundo! 123");
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });
});
