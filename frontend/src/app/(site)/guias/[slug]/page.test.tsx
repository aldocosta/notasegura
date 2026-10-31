import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { notFound } from "next/navigation";
import { GUIDES, findGuide } from "@/lib/guides";
import { COMPARISON_SECTION_TITLES } from "@/lib/guides/types";
import GuidePage, { dynamicParams, generateMetadata, generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/guias/como-guardar-senhas"),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

async function renderGuide(slug: string) {
  return render(await GuidePage({ params: Promise.resolve({ slug }) }));
}

function sectionOf(name: string) {
  return within(screen.getByRole("heading", { level: 2, name }).closest("section")!);
}

function jsonLd(container: HTMLElement): Array<Record<string, unknown>> {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]'), (s) =>
    JSON.parse(s.textContent ?? ""),
  );
}

describe("GuidePage", () => {
  it("generates the eight slugs", () => {
    expect(generateStaticParams()).toEqual(GUIDES.map((g) => ({ slug: g.slug })));
    expect(generateStaticParams()).toHaveLength(8);
    expect(dynamicParams).toBe(false);
  });

  it("renders a comparison", async () => {
    await renderGuide("aes-gcm-ou-chacha20-poly1305");
    const guide = findGuide("aes-gcm-ou-chacha20-poly1305")!;
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(guide.title);
    expect(within(screen.getByRole("list", { name: "Destaques" })).getAllByRole("listitem")).toHaveLength(3);
    const h2 = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(h2.slice(0, h2.indexOf("Algoritmos citados"))).toEqual([...COMPARISON_SECTION_TITLES]);
  });

  it("renders the comparison table", async () => {
    const { container } = await renderGuide("sha-256-sha-1-ou-md5");
    const tables = container.querySelectorAll("table");
    expect(tables).toHaveLength(1);
    const table = tables[0];
    expect(table.querySelector("caption")?.textContent?.trim()).toBeTruthy();
    expect(Array.from(table.querySelectorAll('th[scope="col"]'), (th) => th.textContent)).toEqual([
      "Critério",
      "MD5",
      "SHA-1",
      "SHA-256",
    ]);
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    expect(rows.length).toBeGreaterThanOrEqual(4);
    for (const row of rows) {
      expect(row.firstElementChild?.tagName).toBe("TH");
      expect(row.firstElementChild).toHaveAttribute("scope", "row");
      expect(row.children).toHaveLength(4);
    }
    expect(table.parentElement).toHaveClass("overflow-x-auto");
    expect(table.parentElement?.tagName).toBe("DIV");
  });

  it("renders a practical guide", async () => {
    await renderGuide("como-enviar-uma-senha-com-seguranca");
    const guide = findGuide("como-enviar-uma-senha-com-seguranca")!;
    expect(screen.getAllByRole("heading", { level: 2 })[0]).toHaveTextContent("Resumo");
    const steps = guide.sections.find((s) => s.items)!.items!;
    const list = screen.getByText(steps[0]).closest("ul");
    expect(list).not.toBeNull();
    expect(within(list!).getAllByRole("listitem").map((li) => li.textContent)).toEqual(steps);
  });

  it("links the cited algorithms, the related guides, and the product", async () => {
    await renderGuide("aes-gcm-ou-chacha20-poly1305");
    expect(sectionOf("Algoritmos citados").getByRole("link", { name: "Ler sobre AES-256-GCM" })).toHaveAttribute(
      "href",
      "/algoritmos/aes-gcm",
    );
    const others = sectionOf("Outros guias");
    for (const slug of ["criptografia-hash-ou-codificacao", "rsa-ou-curvas-elipticas"]) {
      expect(others.getByRole("link", { name: findGuide(slug)!.title })).toHaveAttribute("href", `/guias/${slug}`);
    }
    expect(others.getByRole("link", { name: "Todos os guias" })).toHaveAttribute("href", "/guias");
    expect(screen.getByRole("link", { name: "Criar uma nota" })).toHaveAttribute("href", "/#criar-nota");
    const hrefs = others.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).not.toContain("/guias/aes-gcm-ou-chacha20-poly1305");
  });

  it("renders the breadcrumb", async () => {
    await renderGuide("como-guardar-senhas");
    const guide = findGuide("como-guardar-senhas")!;
    const nav = within(screen.getByRole("navigation", { name: "Trilha de navegação" }));
    expect(nav.getAllByRole("link").map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
      ["Início", "/"],
      ["Guias", "/guias"],
    ]);
    const last = nav.getByText(guide.title);
    expect(last.closest("a")).toBeNull();
    expect(last).toHaveAttribute("aria-current", "page");
  });

  it("renders the structured data", async () => {
    const slug = "como-guardar-senhas";
    const { container } = await renderGuide(slug);
    const data = jsonLd(container);
    const article = data.find((d) => d["@type"] === "Article") as { headline: string; image: string } | undefined;
    expect(article).toBeDefined();
    expect(article!.headline).toBe(screen.getByRole("heading", { level: 1 }).textContent);
    expect(article!.image.endsWith(`/guias/${slug}/opengraph-image`)).toBe(true);
    const breadcrumb = data.find((d) => d["@type"] === "BreadcrumbList") as
      | { itemListElement: unknown[] }
      | undefined;
    expect(breadcrumb?.itemListElement).toHaveLength(3);
    for (const script of container.querySelectorAll('script[type="application/ld+json"]')) {
      expect(script.textContent).not.toContain("<");
    }
  });

  it("builds the metadata", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "como-guardar-senhas" }) });
    expect(metadata.title).toBe(findGuide("como-guardar-senhas")!.title);
    expect(metadata.alternates?.canonical).toBe("/guias/como-guardar-senhas");
    expect(metadata.openGraph).toMatchObject({ type: "article" });
    expect((metadata.openGraph?.images as unknown as Array<{ url: string }>)[0].url).toBe(
      "/guias/como-guardar-senhas/opengraph-image",
    );
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(GuidePage({ params: Promise.resolve({ slug: "nao-existe" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
