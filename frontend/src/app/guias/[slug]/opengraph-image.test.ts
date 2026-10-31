// @vitest-environment node
import { describe, expect, it } from "vitest";
import { alt, contentType, generateStaticParams, size } from "./opengraph-image";
import { generateStaticParams as pageParams } from "../../(site)/guias/[slug]/page";

describe("guide share image", () => {
  it("exports the image settings", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
    expect(alt).toBe("Nota Segura - BR");
  });

  it("generates the same params as the page", () => {
    expect(generateStaticParams()).toEqual(pageParams());
  });
});
