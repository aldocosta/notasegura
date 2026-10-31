import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SobrePage from "./page";

afterEach(() => {
  cleanup();
});

describe("Sobre", () => {
  it("states the 30-day and 50-view limits", () => {
    const { container } = render(<SobrePage />);
    const text = container.textContent ?? "";
    expect(text).toContain("de 1 a 30");
    expect(text).toContain("de 1 a 50");
    expect(text).not.toContain("de 1 a 7");
    expect(text).not.toContain("de 1 a 10");
  });

  it("links to the unified privacy and terms page", () => {
    render(<SobrePage />);
    expect(screen.getByRole("link", { name: "Política de Privacidade e Termos de Uso" })).toHaveAttribute(
      "href",
      "/privacidade",
    );
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).not.toContain("/termos");
  });
});
