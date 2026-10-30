import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import NotFound from "./not-found";

afterEach(() => {
  cleanup();
});

describe("NotFound", () => {
  it("explains the error and links home", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: "Página não encontrada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar para o início" })).toHaveAttribute("href", "/");
  });

  it("shows the logo symbol", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
