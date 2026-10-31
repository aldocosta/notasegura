// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BRAND_COLORS } from "./brand";

const TOKENS: Record<keyof typeof BRAND_COLORS, string> = {
  primary: "--color-primary",
  primaryDeep: "--color-primary-deep",
  onPrimary: "--color-on-primary",
  limeHero: "--color-lime-hero",
};

function tokenValue(css: string, token: string): string | undefined {
  return css.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`))?.[1];
}

describe("BRAND_COLORS", () => {
  it("matches the color tokens", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
    for (const [key, token] of Object.entries(TOKENS) as Array<[keyof typeof BRAND_COLORS, string]>) {
      const value = tokenValue(css, token);
      expect(value, token).toBeDefined();
      expect(BRAND_COLORS[key].toLowerCase(), token).toBe(value!.toLowerCase());
    }
  });
});
