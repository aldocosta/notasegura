import { describe, expect, it } from "vitest";
import { encrypt, playfairGrid } from "./playfair";
import type { EncryptResult } from "./types";

const KEYWORD = "PLAYFAIREXAMPLE";
const TEXT = "Hide the gold in the tree stump";

function detail(result: EncryptResult, label: string): string {
  const found = result.details.find((d) => d.label === label);
  expect(found, label).toBeDefined();
  return found!.value;
}

describe("Cifra de Playfair", () => {
  it("builds the grid", () => {
    expect(playfairGrid(KEYWORD).join("")).toBe("PLAYFIREXMBCDGHKNOQSTUVWZ");
  });

  it("matches the classic example", async () => {
    expect((await encrypt(TEXT, { keyword: KEYWORD })).output).toBe("BMODZBXDNABEKUDMUIXMMOUVIF");
  });

  it("decrypts to the prepared text", async () => {
    const result = await encrypt(TEXT, { keyword: KEYWORD });
    expect(await result.decrypt!()).toBe("HIDETHEGOLDINTHETREXESTUMP");
  });

  it("replaces J and removes accents", async () => {
    const result = await encrypt("Já", { keyword: "chave" });
    expect(await result.decrypt!()).toBe("IA");
  });

  it("shows the keyword and the grid", async () => {
    const result = await encrypt(TEXT, { keyword: KEYWORD });
    expect(detail(result, "Palavra-chave")).toBe(KEYWORD);
    const groups = detail(result, "Grade").split(" ");
    expect(groups).toHaveLength(5);
    for (const group of groups) {
      expect(group).toMatch(/^[A-Z]{5}$/);
    }
  });
});
