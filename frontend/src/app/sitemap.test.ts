// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "./sitemap";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://notasegura.example");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("lists exactly the home and the trust pages", () => {
    expect(sitemap().map((e) => e.url)).toEqual([
      "https://notasegura.example",
      "https://notasegura.example/sobre",
      "https://notasegura.example/privacidade",
      "https://notasegura.example/contato",
    ]);
    for (const entry of sitemap()) {
      expect(entry.url).not.toContain("/termos");
    }
  });

  it("lists no note URL", () => {
    for (const entry of sitemap()) {
      expect(entry.url).not.toContain("/n/");
    }
  });
});
