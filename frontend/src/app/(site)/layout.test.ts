import { afterEach, describe, expect, it, vi } from "vitest";
import { generateMetadata } from "./layout";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("(site) layout metadata", () => {
  it("adds the google-adsense-account meta for a valid client ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-1234567890123456");
    expect(await generateMetadata()).toEqual({
      other: { "google-adsense-account": "ca-pub-1234567890123456" },
    });
  });

  it("adds no meta without a valid client ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", undefined);
    expect(await generateMetadata()).not.toHaveProperty("other");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "pub-123");
    expect(await generateMetadata()).not.toHaveProperty("other");
  });
});
