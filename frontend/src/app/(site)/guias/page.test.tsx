import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GUIDES } from "@/lib/guides";
import GuiasPage, { metadata } from "./page";

afterEach(() => {
  cleanup();
});

function jsonLd(container: HTMLElement): Array<Record<string, unknown>> {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]'), (s) =>
    JSON.parse(s.textContent ?? ""),
  );
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

describe("Guias", () => {
  it("renders the heading and the introduction", () => {
    render(<GuiasPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Guias de criptografia e segurança");
    const intro = screen.getByRole("heading", { level: 2, name: "Como usar estes guias" }).closest("section")!;
    const paragraphs = Array.from(intro.querySelectorAll("p"));
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(paragraphs.length).toBeLessThanOrEqual(3);
    const words = paragraphs.reduce((total, p) => total + wordCount(p.textContent ?? ""), 0);
    expect(words).toBeGreaterThanOrEqual(120);
    expect(words).toBeLessThanOrEqual(300);
  });

  it("lists the guides by kind", () => {
    render(<GuiasPage />);
    for (const [name, kind] of [
      ["Comparações", "Comparação"],
      ["Guias práticos", "Guia prático"],
    ] as const) {
      const expected = GUIDES.filter((g) => g.kind === kind);
      expect(expected).toHaveLength(4);
      const links = within(screen.getByRole("list", { name })).getAllByRole("link");
      expect(links.map((l) => [l.textContent, l.getAttribute("href")]), name).toEqual(
        expected.map((g) => [g.title, `/guias/${g.slug}`]),
      );
    }
  });

  it("builds the metadata", () => {
    expect(metadata.title).toBe("Guias de criptografia e segurança");
    expect(metadata.alternates?.canonical).toBe("/guias");
    expect(metadata.openGraph).toMatchObject({ type: "website" });
  });

  it("renders the breadcrumb data", () => {
    const { container } = render(<GuiasPage />);
    const breadcrumb = jsonLd(container).find((d) => d["@type"] === "BreadcrumbList") as
      | { itemListElement: Array<{ name: string }> }
      | undefined;
    expect(breadcrumb).toBeDefined();
    expect(breadcrumb!.itemListElement.map((i) => i.name)).toEqual(["Início", "Guias"]);
  });
});
