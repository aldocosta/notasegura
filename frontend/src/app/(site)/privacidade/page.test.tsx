import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import PrivacidadePage from "./page";

afterEach(() => {
  cleanup();
});

function linkHrefs(): Array<string | null> {
  return screen.getAllByRole("link").map((link) => link.getAttribute("href"));
}

describe("Política de Privacidade", () => {
  it("discloses advertising cookies", () => {
    const { container } = render(<PrivacidadePage />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/cookies/i);
    expect(text).toMatch(/Google/);
    expect(linkHrefs()).toEqual(
      expect.arrayContaining(["https://adssettings.google.com/", "https://www.aboutads.info/"]),
    );
  });

  it("discloses data handling", () => {
    const { container } = render(<PrivacidadePage />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/frase secreta/i);
    expect(text).toMatch(/texto claro/i);
    expect(text).toMatch(/criptografad/i);
    expect(text).toMatch(/visualiza/i);
    expect(text).toMatch(/\bIP\b/);
    expect(text).toMatch(/conta/i);
    expect(text).toMatch(/LGPD/);
    expect(linkHrefs()).toContain("/contato");
  });
});
