import type { ComponentType } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import Sobre from "./sobre/page";
import Privacidade from "./privacidade/page";
import Termos from "./termos/page";
import Contato from "./contato/page";

const PAGES: Array<[string, ComponentType]> = [
  ["Sobre", Sobre],
  ["Privacidade", Privacidade],
  ["Termos", Termos],
  ["Contato", Contato],
];

afterEach(() => {
  cleanup();
});

describe("trust pages", () => {
  it.each<[string, ComponentType]>([
    ["Sobre", Sobre],
    ["Privacidade", Privacidade],
    ["Termos", Termos],
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

  it("shows an icon next to every h2 on /privacidade", () => {
    render(<Privacidade />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBeGreaterThan(0);
    for (const heading of headings) {
      expect(heading.parentElement!.querySelector("svg"), heading.textContent ?? "").not.toBeNull();
    }
  });
});
