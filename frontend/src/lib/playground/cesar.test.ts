import { describe, expect, it } from "vitest";
import { encrypt } from "./cesar";

describe("Cifra de César", () => {
  it("shifts letters and keeps other characters", async () => {
    expect((await encrypt("Abc, xyz!", { shift: 3 })).output).toBe("Def, abc!");
  });

  it("keeps accented letters", async () => {
    expect((await encrypt("olá", { shift: 3 })).output).toBe("roá");
  });

  it("decrypts back", async () => {
    const result = await encrypt("Olá, mundo! 123", { shift: 13 });
    expect(await result.decrypt!()).toBe("Olá, mundo! 123");
  });

  it("shows the shift", async () => {
    expect((await encrypt("Abc", { shift: 3 })).details).toEqual([{ label: "Deslocamento", value: "3" }]);
  });
});
