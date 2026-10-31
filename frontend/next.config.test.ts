// @vitest-environment node
import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

describe("next.config", () => {
  it("redirects /termos permanently to the terms part", async () => {
    expect(await nextConfig.redirects!()).toEqual([
      { source: "/termos", destination: "/privacidade#termos", permanent: true },
    ]);
  });
});
