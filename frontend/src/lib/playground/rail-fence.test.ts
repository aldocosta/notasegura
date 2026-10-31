import { describe, expect, it } from "vitest";
import { encrypt } from "./rail-fence";

describe("Cerca de trilho", () => {
  it("matches the classic example", async () => {
    expect((await encrypt("WEAREDISCOVEREDFLEEATONCE", { rails: 3 })).output).toBe("WECRLTEERDSOEEFEAOCAIVDEN");
  });

  it("round-trips any text", async () => {
    for (let rails = 2; rails <= 10; rails++) {
      const result = await encrypt("Olá, mundo! 123", { rails });
      expect(await result.decrypt!(), String(rails)).toBe("Olá, mundo! 123");
    }
  });

  it("shows the rails", async () => {
    expect((await encrypt("segredo", { rails: 3 })).details).toEqual([{ label: "Trilhos", value: "3" }]);
  });
});
