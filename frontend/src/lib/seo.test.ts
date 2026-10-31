import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd, jsonLdHtml, pageMetadata, siteMetadata } from "./seo";

const SITE = "https://notasegura.example";
const SITE_IMAGES = [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Nota Segura - BR" }];

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("seo", () => {
  it("builds the site metadata", () => {
    const metadata = siteMetadata();
    expect((metadata.metadataBase as URL).href).toBe(`${SITE}/`);
    expect(metadata.title).toMatchObject({ template: "%s | Nota Segura - BR" });
    expect(metadata.openGraph).toMatchObject({ locale: "pt_BR" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(metadata.openGraph?.images).toEqual(SITE_IMAGES);
    expect(metadata.twitter?.images).toEqual(SITE_IMAGES);
  });

  it("builds the page metadata", () => {
    const metadata = pageMetadata({ title: "T", description: "D", path: "/guias" });
    expect(metadata.alternates?.canonical).toBe("/guias");
    expect(metadata.openGraph).toEqual({
      title: "T",
      description: "D",
      url: "/guias",
      siteName: "Nota Segura - BR",
      locale: "pt_BR",
      type: "website",
      images: SITE_IMAGES,
    });
    expect(metadata.twitter).toEqual({ card: "summary_large_image", title: "T", description: "D", images: SITE_IMAGES });
  });

  it("sets the share image", () => {
    const site = pageMetadata({ title: "T", description: "D", path: "/sobre" });
    expect(site.openGraph?.images).toEqual(SITE_IMAGES);
    expect(site.twitter?.images).toEqual(SITE_IMAGES);
    const page = pageMetadata({ title: "T", description: "D", path: "/guias/x", image: "/guias/x/opengraph-image" });
    for (const images of [page.openGraph?.images, page.twitter?.images]) {
      expect((images as unknown as Array<{ url: string }>).map((image) => image.url)).toEqual(["/guias/x/opengraph-image"]);
    }
  });

  it("uses the article type", () => {
    const metadata = pageMetadata({ title: "T", description: "D", path: "/guias/x", type: "article" });
    expect(metadata.openGraph).toMatchObject({ type: "article" });
  });

  it("builds absolute URLs", () => {
    expect(absoluteUrl("/")).toBe(SITE);
    expect(absoluteUrl("/guias")).toBe(`${SITE}/guias`);
  });

  it("builds the Article data", () => {
    const data = articleJsonLd({
      path: "/guias/como-guardar-senhas",
      headline: "Título",
      description: "Descrição",
      publishedAt: "2026-10-31",
      image: "/guias/como-guardar-senhas/opengraph-image",
    }) as {
      "@type": string;
      inLanguage: string;
      datePublished: string;
      dateModified: string;
      url: string;
      mainEntityOfPage: string;
      image: string;
      author: { name: string };
      publisher: { name: string; logo: { url: string } };
    };
    expect(data["@type"]).toBe("Article");
    expect(data.inLanguage).toBe("pt-BR");
    expect(data.datePublished).toBe("2026-10-31");
    expect(data.dateModified).toBe("2026-10-31");
    expect(data.url).toBe(`${SITE}/guias/como-guardar-senhas`);
    expect(data.mainEntityOfPage).toBe(`${SITE}/guias/como-guardar-senhas`);
    expect(data.image).toBe(`${SITE}/guias/como-guardar-senhas/opengraph-image`);
    expect(data.author.name).toBe("Nota Segura - BR");
    expect(data.publisher.name).toBe("Nota Segura - BR");
    expect(data.publisher.logo.url.endsWith("/icon.svg")).toBe(true);
  });

  it("builds the BreadcrumbList data", () => {
    const data = breadcrumbJsonLd([
      { name: "Início", path: "/" },
      { name: "Guias", path: "/guias" },
      { name: "Como guardar senhas", path: "/guias/como-guardar-senhas" },
    ]) as { "@type": string; itemListElement: Array<{ position: number; name: string; item: string }> };
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(data.itemListElement.map((i) => i.name)).toEqual(["Início", "Guias", "Como guardar senhas"]);
    expect(data.itemListElement.map((i) => i.item)).toEqual([
      SITE,
      `${SITE}/guias`,
      `${SITE}/guias/como-guardar-senhas`,
    ]);
  });

  it("escapes < in JSON-LD", () => {
    const html = jsonLdHtml({ a: "</script>" });
    expect(html).not.toContain("<");
    expect(html).toContain("\\u003c/script>");
    expect(JSON.parse(html)).toEqual({ a: "</script>" });
  });
});
