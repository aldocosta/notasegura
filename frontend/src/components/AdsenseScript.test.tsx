import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import AdsenseScript from "./AdsenseScript";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("AdsenseScript", () => {
  it("renders nothing without a client ID", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", undefined);
    const { container } = render(<AdsenseScript />);
    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector('script[src*="adsbygoogle"]')).toBeNull();
  });

  it("renders nothing with an invalid client ID", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "pub-123");
    const { container } = render(<AdsenseScript />);
    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector('script[src*="adsbygoogle"]')).toBeNull();
  });
});
