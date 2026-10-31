import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Home from "./page";

vi.mock("@/lib/api", () => ({
  createNote: vi.fn(),
}));

describe("Home - Como funciona CTA", () => {
  let scrollIntoView: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView as unknown as Element["scrollIntoView"];
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the "Criar a primeira nota" link inside the "Como funciona" section', () => {
    const { container } = render(<Home />);
    const section = container.querySelector<HTMLElement>("#como-funciona");
    expect(section).not.toBeNull();
    const link = within(section!).getByRole("link", { name: "Criar a primeira nota" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#criar-nota");
  });

  it('places "Criar a primeira nota" as the last interactive element of the card', () => {
    const { container } = render(<Home />);
    const interactive = container.querySelectorAll("#como-funciona a, #como-funciona button");
    expect(interactive.length).toBeGreaterThan(0);
    expect(interactive[interactive.length - 1]).toHaveTextContent("Criar a primeira nota");
  });

  it("places Como funciona before the form", () => {
    render(<Home />);
    const howItWorks = document.getElementById("como-funciona")!;
    const form = document.getElementById("criar-nota")!;
    expect(howItWorks.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("has a #criar-nota section containing the create note form", () => {
    render(<Home />);
    const section = document.getElementById("criar-nota");
    expect(section).not.toBeNull();
    expect(section).toContainElement(screen.getByRole("heading", { name: "Criar uma nota" }));
  });

  it('scrolls smoothly to the form when "Criar a primeira nota" is clicked', () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("link", { name: "Criar a primeira nota" }));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById("criar-nota"));
  });

  it('focuses the note textarea after clicking "Criar a primeira nota"', () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("link", { name: "Criar a primeira nota" }));
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Texto da nota" }));
  });

  it("limits the days input to 1-30", () => {
    render(<Home />);
    const input = screen.getByLabelText(/Expiração/);
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "30");
    expect(input.closest("label")).toHaveTextContent("1-30");
  });

  it("limits the views input to 1-50", () => {
    render(<Home />);
    const input = screen.getByLabelText(/Máximo de visualizações/);
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "50");
    expect(input.closest("label")).toHaveTextContent("1-50");
  });

  it("states the new limits in Como funciona", () => {
    render(<Home />);
    const text = document.getElementById("como-funciona")!.textContent ?? "";
    expect(text).toContain("(1-30)");
    expect(text).toContain("(1-50)");
    expect(text).not.toContain("(1-7)");
    expect(text).not.toContain("(1-10)");
  });

  it("places the playground after the create form", () => {
    render(<Home />);
    const form = document.getElementById("criar-nota")!;
    const playground = document.getElementById("testar-algoritmos")!;
    expect(form.compareDocumentPosition(playground) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(playground).getByRole("heading", { level: 2, name: "Teste os algoritmos" })).toBeInTheDocument();
  });

  it('keeps "Como Funciona!" scrolling to #como-funciona', () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("link", { name: "Como Funciona!" }));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById("como-funciona"));
  });
});
