import type { ComponentType } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Sobre from "./sobre/page";
import Privacidade from "./privacidade/page";
import Termos from "./termos/page";
import Contato from "./contato/page";

afterEach(() => {
  cleanup();
});

describe("trust pages", () => {
  it.each<[string, ComponentType]>([
    ["Sobre", Sobre],
    ["Privacidade", Privacidade],
    ["Termos", Termos],
    ["Contato", Contato],
  ])("%s renders one h1 and at least three paragraphs", (_name, Page) => {
    const { container } = render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const paragraphs = Array.from(container.querySelectorAll("p")).filter(
      (p) => (p.textContent ?? "").trim().length > 0,
    );
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
  });
});
