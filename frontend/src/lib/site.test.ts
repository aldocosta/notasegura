import { afterEach, describe, expect, it, vi } from "vitest";
import {
  NAV_LINKS,
  TRUST_PAGES,
  getAdsenseClient,
  getAdsensePublisherId,
  getContactEmail,
  getSiteUrl,
} from "./site";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site config", () => {
  it("returns the site URL without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://notasegura.example/");
    expect(getSiteUrl()).toBe("https://notasegura.example");
  });

  it("defaults the site URL to localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    expect(getSiteUrl()).toBe("http://localhost:3005");
  });

  it("accepts a valid AdSense client ID", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-1234567890123456");
    expect(getAdsenseClient()).toBe("ca-pub-1234567890123456");
    expect(getAdsensePublisherId()).toBe("pub-1234567890123456");
  });

  it.each(["", "pub-1234567890123456", "ca-pub-123", "ca-pub-12345678901234AB"])(
    "rejects the client ID %s",
    (value) => {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", value);
      expect(getAdsenseClient()).toBeNull();
      expect(getAdsensePublisherId()).toBeNull();
    },
  );

  it("returns null for an unset or blank contact email", () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", "");
    expect(getContactEmail()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", "   ");
    expect(getContactEmail()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", " contato@example.com ");
    expect(getContactEmail()).toBe("contato@example.com");
  });

  it("lists the three trust pages", () => {
    expect(TRUST_PAGES.map((p) => p.href)).toEqual(["/sobre", "/privacidade", "/contato"]);
    expect(TRUST_PAGES.map((p) => p.label)).toEqual(["Sobre", "Privacidade e Termos", "Contato"]);
  });

  it("lists the main menu links", () => {
    expect(NAV_LINKS.map((l) => [l.label, l.href])).toEqual([
      ["Sobre", "/sobre"],
      ["Privacidade e Termos", "/privacidade"],
      ["Contato", "/contato"],
    ]);
  });
});
