import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
  it("links to the three trust pages", () => {
    render(<SiteFooter />);
    const expected: Array<[string, string]> = [
      ["Sobre", "/sobre"],
      ["Privacidade e Termos", "/privacidade"],
      ["Contato", "/contato"],
    ];
    for (const [name, href] of expected) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(screen.queryByRole("link", { name: "Termos" })).toBeNull();
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).not.toContain("/termos");
  });

  it("shows the current year", () => {
    const { container } = render(<SiteFooter />);
    expect(container.textContent).toContain(String(new Date().getFullYear()));
  });

  it("shows the logo", () => {
    const { container } = render(<SiteFooter />);
    const footer = container.querySelector("footer")!;
    expect(footer.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(footer).toHaveTextContent("Nota Segura");
  });
});
