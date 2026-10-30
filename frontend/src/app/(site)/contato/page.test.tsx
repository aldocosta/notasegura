import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ContatoPage from "./page";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("Contato", () => {
  it("shows the configured email", () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", "contato@example.com");
    render(<ContatoPage />);
    expect(screen.getByRole("link", { name: "contato@example.com" })).toHaveAttribute(
      "href",
      "mailto:contato@example.com",
    );
  });

  it("renders no mailto link without an email", () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", undefined);
    const { container } = render(<ContatoPage />);
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
  });
});
