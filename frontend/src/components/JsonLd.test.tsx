import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import JsonLd from "./JsonLd";

afterEach(() => {
  cleanup();
});

describe("JsonLd", () => {
  it("renders the data as JSON-LD", () => {
    const data = { "@context": "https://schema.org", "@type": "Article", headline: "Título </script>" };
    const { container } = render(<JsonLd data={data} />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    expect(JSON.parse(scripts[0].textContent ?? "")).toEqual(data);
  });
});
