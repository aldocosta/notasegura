import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { IconClock, IconKey, IconLock, IconScale, IconShield } from "./icons";
import { TrustPage, TrustPart, TrustSection, type TrustHighlight } from "./TrustPage";

const HIGHLIGHTS: TrustHighlight[] = [
  { icon: IconKey, title: "Primeiro", text: "Texto do primeiro destaque." },
  { icon: IconClock, title: "Segundo", text: "Texto do segundo destaque." },
  { icon: IconLock, title: "Terceiro", text: "Texto do terceiro destaque." },
];

function renderPage() {
  return render(
    <TrustPage title="Título" lead="Frase de abertura." icon={IconShield} highlights={HIGHLIGHTS}>
      <p>Conteúdo.</p>
    </TrustPage>,
  );
}

afterEach(() => {
  cleanup();
});

describe("TrustPage", () => {
  it("renders the hero with icon, title, and lead", () => {
    const { container } = renderPage();
    const hero = container.querySelector<HTMLElement>("[data-hero]");
    expect(hero).not.toBeNull();
    expect(within(hero!).getByRole("heading", { level: 1, name: "Título" })).toBeInTheDocument();
    expect(hero!.querySelector("svg")).not.toBeNull();
    expect(hero).toHaveTextContent("Frase de abertura.");
  });

  it("renders the breadcrumb", () => {
    render(
      <TrustPage
        title="Título"
        lead="Frase de abertura."
        icon={IconShield}
        breadcrumb={[{ name: "Início", href: "/" }, { name: "Algoritmos", href: "/algoritmos" }, { name: "Cifra de César" }]}
        highlights={HIGHLIGHTS}
      >
        <p>Conteúdo.</p>
      </TrustPage>,
    );
    const nav = within(screen.getByRole("navigation", { name: "Trilha de navegação" }));
    const links = nav.getAllByRole("link");
    expect(links.map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
      ["Início", "/"],
      ["Algoritmos", "/algoritmos"],
    ]);
    const items = nav.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    const last = nav.getByText("Cifra de César");
    expect(last.closest("a")).toBeNull();
    expect(last).toHaveAttribute("aria-current", "page");
    expect(items[2]).toContainElement(last);
  });

  it("renders no breadcrumb without the prop", () => {
    renderPage();
    expect(screen.queryByRole("navigation", { name: "Trilha de navegação" })).toBeNull();
  });

  it("renders one tile per highlight", () => {
    renderPage();
    const items = within(screen.getByRole("list", { name: "Destaques" })).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    items.forEach((item, i) => {
      expect(item.querySelector("svg")).not.toBeNull();
      expect(item).toHaveTextContent(HIGHLIGHTS[i].title);
    });
  });

  it("renders an icon next to a section heading", () => {
    render(
      <TrustSection title="Seção" icon={IconLock}>
        <p>Texto.</p>
      </TrustSection>,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Seção" });
    expect(heading.parentElement!.querySelector("svg")).not.toBeNull();
  });

  it("renders a part with an anchor and an icon", () => {
    const { container } = render(
      <TrustPart id="termos" title="Termos de Uso" icon={IconScale}>
        <p>Texto.</p>
      </TrustPart>,
    );
    const part = container.querySelector<HTMLElement>("#termos");
    expect(part).not.toBeNull();
    expect(part!.tagName).toBe("SECTION");
    const heading = screen.getByRole("heading", { level: 2, name: "Termos de Uso" });
    expect(part).toContainElement(heading);
    expect(heading.parentElement!.querySelector("svg")).not.toBeNull();
    expect(heading.id).not.toBe("");
    expect(part).toHaveAttribute("aria-labelledby", heading.id);
  });

  it("renders a section heading at level 3", () => {
    render(
      <TrustSection title="Seção" icon={IconLock} level={3}>
        <p>Texto.</p>
      </TrustSection>,
    );
    const heading = screen.getByRole("heading", { level: 3, name: "Seção" });
    expect(heading.parentElement!.querySelector("svg")).not.toBeNull();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });

  it("renders the mint tone", () => {
    const { container } = render(
      <TrustSection title="Aviso" icon={IconLock} tone="mint">
        <p>Texto.</p>
      </TrustSection>,
    );
    expect(container.querySelector("section")).toHaveClass("bg-mint-50");
  });
});
