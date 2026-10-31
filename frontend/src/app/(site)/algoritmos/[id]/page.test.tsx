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
  });

  it("calls notFound for an unknown id", async () => {
    await expect(AlgorithmPage({ params: Promise.resolve({ id: "rot47" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
