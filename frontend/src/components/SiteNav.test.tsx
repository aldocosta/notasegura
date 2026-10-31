import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import SiteHeader from "./SiteHeader";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

function mainNav() {
  return screen.getByRole("navigation", { name: "Principal" });
}

function menuButton() {
  return screen.getByRole("button", { name: "Menu" });
}

beforeEach(() => {
  mockedUsePathname.mockReturnValue("/");
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SiteNav", () => {
  it("renders the four links in order", () => {
    render(<SiteHeader />);
    const links = within(mainNav()).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links.map((l) => [l.textContent, l.getAttribute("href")])).toEqual(
      NAV_LINKS.map((l) => [l.label, l.href]),
    );
  });

  it("marks the current page", () => {
    mockedUsePathname.mockReturnValue("/privacidade");
    render(<SiteHeader />);
    const nav = within(mainNav());
    expect(nav.getByRole("link", { name: "Privacidade e Termos" })).toHaveAttribute("aria-current", "page");
    for (const name of ["Sobre", "Contato"]) {
      expect(nav.getByRole("link", { name })).not.toHaveAttribute("aria-current");
    }
  });

  it("marks Algoritmos on the index", () => {
    mockedUsePathname.mockReturnValue("/algoritmos");
    render(<SiteHeader />);
    const nav = within(mainNav());
    expect(nav.getByRole("link", { name: "Algoritmos" })).toHaveAttribute("aria-current", "page");
    for (const name of ["Sobre", "Privacidade e Termos", "Contato"]) {
      expect(nav.getByRole("link", { name })).not.toHaveAttribute("aria-current");
    }
  });

  it("marks nothing on an article page", () => {
    mockedUsePathname.mockReturnValue("/algoritmos/cesar");
    render(<SiteHeader />);
    for (const link of within(mainNav()).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("marks nothing on the home page", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<SiteHeader />);
    for (const link of within(mainNav()).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("toggles the mobile menu", () => {
    render(<SiteHeader />);
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(menuButton()).toHaveAttribute("aria-controls", "menu-principal");
    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("menu-principal")).toBeInTheDocument();
    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns focus", () => {
    render(<SiteHeader />);
    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(menuButton());
  });

  it("closes when a link is clicked", () => {
    render(<SiteHeader />);
    fireEvent.click(menuButton());
    const menu = document.getElementById("menu-principal");
    expect(menu).not.toBeNull();
    fireEvent.click(within(menu!).getByRole("link", { name: "Sobre" }));
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });
});
