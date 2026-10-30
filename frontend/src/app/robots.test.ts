// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "./robots";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots", () => {
  it("blocks notes and the API for every crawler", () => {
    const rules = robots().rules;
    const list: Array<{ userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[] }> =
      Array.isArray(rules) ? rules : [rules];
    for (const userAgent of ["*", "Mediapartners-Google"]) {
      const rule = list.find((r) => r.userAgent === userAgent);
      expect(rule).toBeDefined();
      expect(rule!.allow).toBe("/");
      expect(rule!.disallow).toEqual(expect.arrayContaining(["/n/", "/api/"]));
    }
  });

  it("points to the sitemap on the site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://notasegura.example");
    expect(robots().sitemap).toBe("https://notasegura.example/sitemap.xml");
  });
});
