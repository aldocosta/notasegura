import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Logo, LogoMark } from "./Logo";

afterEach(() => {
  cleanup();
});

describe("Logo", () => {
  it("hides the mark from assistive technology", () => {
    const { container } = render(<LogoMark />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("renders the wordmark with the BR badge", () => {
    const { container } = render(<Logo />);
    expect(container.textContent).toContain("Nota Segura");
    expect(screen.getByText("BR")).toBeInTheDocument();
  });

  it("omits the wordmark when asked", () => {
    const { container } = render(<Logo showWordmark={false} />);
    expect(container.textContent).not.toContain("Nota Segura");
  });

  it("uses white on the inverse tone", () => {
    const { container } = render(<LogoMark tone="inverse" />);
    const svg = container.querySelector("svg")!;
    const sheet = svg.querySelector('[data-part="sheet"]')!;
    const keyhole = svg.querySelector('[data-part="keyhole"]')!;
    const sheetFill = sheet.getAttribute("fill");
    expect(
      sheetFill === "#ffffff" || (sheetFill === "currentColor" && svg.classList.contains("text-on-primary")),
    ).toBe(true);
    expect(keyhole.getAttribute("fill")).toMatch(/--color-primary\b|#008254/);
  });
});
