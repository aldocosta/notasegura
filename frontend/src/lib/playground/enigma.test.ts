import { describe, expect, it } from "vitest";
import { enigma, enigmaStep } from "./enigma";

describe("Máquina Enigma", () => {
  it("matches the known output", () => {
    expect(enigma("AAAAA", "AAA")).toBe("BDZGO");
  });

  it("double-steps the middle rotor", () => {
    const positions = ["ADU"];
    for (let i = 0; i < 4; i++) positions.push(enigmaStep(positions[i]));
    expect(positions.slice(1)).toEqual(["ADV", "AEW", "BFX", "BFY"]);
  });

  it("never maps a letter to itself", () => {
    const output = enigma("A".repeat(200), "AAA");
    expect(output).toHaveLength(200);
    expect(output).not.toContain("A");
  });

  it("is reciprocal", () => {
    expect(enigma(enigma("ATAQUEAOAMANHECER", "QWE"), "QWE")).toBe("ATAQUEAOAMANHECER");
  });

  it("keeps other characters and does not step on them", () => {
    expect(enigma("A A", "AAA")).toBe("B D");
  });
});
