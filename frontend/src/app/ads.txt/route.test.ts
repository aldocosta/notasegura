// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ads.txt route", () => {
  it("serves the Google line for a valid client ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-1234567890123456");
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/^text\/plain/);
    expect(await res.text()).toBe("google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");
  });

  it("returns 404 without a client ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", undefined);
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it("returns 404 for an invalid client ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-12AB");
    const res = await GET();
    expect(res.status).toBe(404);
  });
});
