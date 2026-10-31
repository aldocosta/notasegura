import type { ComponentType } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import type { Metadata } from "next";
import Sobre, { metadata as sobreMetadata } from "./sobre/page";
import Privacidade, { metadata as privacidadeMetadata } from "./privacidade/page";
import Contato, { metadata as contatoMetadata } from "./contato/page";

const PAGES: Array<[string, ComponentType]> = [
  ["Sobre", Sobre],
  ["Privacidade", Privacidade],
  ["Contato", Contato],
];

afterEach(() => {
  cleanup();
});

describe("trust pages", () => {
  it.each<[string, ComponentType]>([
    ["Sobre", Sobre],
    ["Privacidade", Privacidade],
    ["Contato", Contato],
  ])("%s renders one h1 and at least three paragraphs", (_name, Page) => {
    const { container } = render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const paragraphs = Array.from(container.querySelectorAll("p")).filter(
      (p) => (p.textContent ?? "").trim().length > 0,
    );
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
  });

  it.each(PAGES)("%s shows a hero and at least three highlights", (_name, Page) => {
    const { container } = render(<Page />);
    const hero = container.querySelector<HTMLElement>("[data-hero]");
    expect(hero).not.toBeNull();
    expect(within(hero!).getByRole("heading", { level: 1 })).toBeInTheDocument();
    const items = within(screen.getByRole("list", { name: "Destaques" })).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it.each(PAGES)("%s hides every svg", (_name, Page) => {
    const { container } = render(<Page />);
    const svgs = Array.from(container.querySelectorAll("svg"));
    expect(svgs.length).toBeGreaterThan(0);
    for (const svg of svgs) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });

  it.each<[string, Metadata, string, string]>([
    [
      "/sobre",
      sobreMetadata,
      "Sobre",
      "O que é o Nota Segura - BR, quem mantém o serviço e como ele continua gratuito.",
    ],
    [
      "/privacidade",
      privacidadeMetadata,
      "Política de Privacidade e Termos de Uso",
      "Quais dados o Nota Segura - BR guarda, como funcionam os cookies de publicidade e as regras de uso do serviço.",
    ],
    [
      "/contato",
      contatoMetadata,
      "Contato",
      "Como falar com o Nota Segura - BR para denunciar abuso ou fazer pedidos de privacidade.",
    ],
  ])("sets the canonical URL of %s", (path, metadata, title, description) => {
    expect(metadata.alternates?.canonical).toBe(path);
    expect(metadata.openGraph).toMatchObject({ type: "website" });
    expect(metadata.title).toBe(title);
    expect(metadata.description).toBe(description);
  });

  it("shows an icon next to every h2 and h3 on /privacidade", () => {
    render(<Privacidade />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h2s.length).toBeGreaterThanOrEqual(2);
    expect(h3s.length).toBeGreaterThanOrEqual(9);
    for (const heading of [...h2s, ...h3s]) {
      expect(heading.parentElement!.querySelector("svg"), heading.textContent ?? "").not.toBeNull();
    }
  });
});
