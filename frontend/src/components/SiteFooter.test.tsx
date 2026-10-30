import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
  it("links to the four trust pages", () => {
    render(<SiteFooter />);
    const expected: Array<[string, string]> = [
      ["Sobre", "/sobre"],
      ["Privacidade", "/privacidade"],
      ["Termos", "/termos"],
      ["Contato", "/contato"],
    ];
    for (const [name, href] of expected) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("shows the current year", () => {
    const { container } = render(<SiteFooter />);
    expect(container.textContent).toContain(String(new Date().getFullYear()));
  });
});
