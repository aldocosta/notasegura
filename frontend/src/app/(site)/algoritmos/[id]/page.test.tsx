import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/lib/algorithms";
import { ARTICLE_SECTION_TITLES } from "@/lib/algorithms/types";
import { ALGORITHMS } from "@/lib/playground";
import AlgorithmPage, { dynamicParams, generateMetadata, generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/algoritmos/cesar"),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

async function renderCesar() {
  render(await AlgorithmPage({ params: Promise.resolve({ id: "cesar" }) }));
}

function seeAlso() {
  const heading = screen.getByRole("heading", { level: 2, name: "Veja também" });
  return within(heading.closest("section")!);
}

describe("AlgorithmPage", () => {
  it("generates the seven ids", () => {
    expect(generateStaticParams()).toEqual(ALGORITHMS.map((a) => ({ id: a.id })));
    expect(dynamicParams).toBe(false);
  });

  it("renders the article", async () => {
    await renderCesar();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cifra de César: o que é e como funciona");
    const h2 = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(h2.filter((t) => (ARTICLE_SECTION_TITLES as readonly (string | null)[]).includes(t))).toEqual([
      ...ARTICLE_SECTION_TITLES,
    ]);
    const tiles = within(screen.getByRole("list", { name: "Destaques" }));
    for (const text of ["Cifra clássica", "Inseguro", "Chave"]) {
      expect(tiles.getByText(text)).toBeInTheDocument();
    }
  });

  it("preselects the algorithm in the playground", async () => {
    await renderCesar();
    const group = within(screen.getByRole("group", { name: "Algoritmos" }));
    expect(group.getByRole("button", { name: "Cifra de César" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("link", { name: "Saiba mais sobre Cifra de César" })).toBeNull();
  });

  it("links related pages and the product", async () => {
    await renderCesar();
    expect(screen.getByRole("link", { name: "Ler sobre Cifra de Vigenère" })).toHaveAttribute(
      "href",
      "/algoritmos/vigenere",
    );
    expect(screen.getByRole("link", { name: "Ler sobre Base64" })).toHaveAttribute("href", "/algoritmos/base64");
    expect(screen.getByRole("link", { name: "Todos os algoritmos" })).toHaveAttribute("href", "/algoritmos");
    expect(screen.getByRole("link", { name: "Criar uma nota" })).toHaveAttribute("href", "/#criar-nota");
    const hrefs = seeAlso()
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).not.toContain("/algoritmos/cesar");
  });

  it("builds the metadata", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ id: "aes-gcm" }) });
    expect(metadata.title).toBe("AES-256-GCM: o que é e como funciona");
    expect(metadata.description).toBe(ARTICLES["aes-gcm"].description);
    expect(metadata.alternates?.canonical).toBe("/algoritmos/aes-gcm");
    expect(metadata.openGraph).toMatchObject({ type: "article" });
    expect((metadata.openGraph?.images as unknown as Array<{ url: string }>)[0].url).toBe(
      "/algoritmos/aes-gcm/opengraph-image",
    );
  });

  it("links the guides that cite the algorithm", async () => {
    render(await AlgorithmPage({ params: Promise.resolve({ id: "aes-gcm" }) }));
    const names = seeAlso()
      .getAllByRole("link")
      .map((link) => link.textContent);
    expect(names).toEqual([
      "Ler sobre AES-256-CBC",
      "Ler sobre RSA-OAEP",
      "Ler o guia: AES-256-GCM ou ChaCha20-Poly1305: qual escolher?",
      "Ler o guia: Criptografia, hash ou codificação: qual é a diferença?",
      "Ler o guia: Como enviar uma senha com segurança",
      "Todos os algoritmos",
    ]);
  });

  it("links no guide when none cites the algorithm", async () => {
    render(await AlgorithmPage({ params: Promise.resolve({ id: "rot13" }) }));
    for (const link of screen.getAllByRole("link")) {
      expect(link.textContent ?? "").not.toMatch(/^Ler o guia:/);
    }
  });

  it("renders the breadcrumb", async () => {
    await renderCesar();
    const nav = within(screen.getByRole("navigation", { name: "Trilha de navegação" }));
    expect(nav.getAllByRole("link").map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
      ["Início", "/"],
      ["Algoritmos", "/algoritmos"],
    ]);
    const last = nav.getByText("Cifra de César");
    expect(last.closest("a")).toBeNull();
    expect(last).toHaveAttribute("aria-current", "page");
  });

  it("renders the structured data", async () => {
    const { container } = render(await AlgorithmPage({ params: Promise.resolve({ id: "enigma" }) }));
    const data = Array.from(container.querySelectorAll('script[type="application/ld+json"]'), (s) =>
      JSON.parse(s.textContent ?? ""),
    ) as Array<{ "@type": string; headline?: string; itemListElement?: Array<{ name: string }> }>;
    expect(data.find((d) => d["@type"] === "Article")?.headline).toBe("Máquina Enigma: o que é e como funciona");
    expect(data.find((d) => d["@type"] === "BreadcrumbList")?.itemListElement?.map((i) => i.name)).toEqual([
      "Início",
      "Algoritmos",
      "Máquina Enigma",
    ]);
  });

  it("calls notFound for an unknown id", async () => {
    await expect(AlgorithmPage({ params: Promise.resolve({ id: "rot47" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
