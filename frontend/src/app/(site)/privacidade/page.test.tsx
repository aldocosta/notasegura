import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import PrivacidadePage, { metadata } from "./page";

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

  it("states the 30-day maximum", () => {
    const { container } = render(<PrivacidadePage />);
    const text = container.textContent ?? "";
    expect(text).toContain("no máximo 30 dias após a criação");
    expect(text).not.toContain("7 dias");
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

  it("has the unified title", () => {
    render(<PrivacidadePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Política de Privacidade e Termos de Uso");
    expect(metadata.title).toBe("Política de Privacidade e Termos de Uso");
  });

  it("shows the privacy part before the terms part", () => {
    const { container } = render(<PrivacidadePage />);
    const privacy = container.querySelector<HTMLElement>("#privacidade");
    const terms = container.querySelector<HTMLElement>("#termos");
    expect(privacy).not.toBeNull();
    expect(terms).not.toBeNull();
    expect(within(privacy!).getByRole("heading", { level: 2, name: "Política de Privacidade" })).toBeInTheDocument();
    expect(within(terms!).getByRole("heading", { level: 2, name: "Termos de Uso" })).toBeInTheDocument();
    expect(privacy!.compareDocumentPosition(terms!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("links to both parts before the privacy part", () => {
    const { container } = render(<PrivacidadePage />);
    const privacyPart = container.querySelector<HTMLElement>("#privacidade");
    expect(privacyPart).not.toBeNull();
    for (const href of ["#privacidade", "#termos"]) {
      const link = container.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
      expect(link, href).not.toBeNull();
      expect(link!.compareDocumentPosition(privacyPart!) & Node.DOCUMENT_POSITION_FOLLOWING, href).toBeTruthy();
    }
  });

  it("discloses the terms of use", () => {
    const { container } = render(<PrivacidadePage />);
    const terms = container.querySelector<HTMLElement>("#termos");
    expect(terms).not.toBeNull();
    const text = terms!.textContent ?? "";
    expect(text).toContain("conteúdo ilegal");
    expect(text).toContain("malware");
    expect(text).toContain("no estado em que se encontra");
    expect(text).toContain("República Federativa do Brasil");
    const hrefs = within(terms!)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/contato");
  });

  it("does not link to /termos", () => {
    render(<PrivacidadePage />);
    expect(linkHrefs()).not.toContain("/termos");
  });
});
