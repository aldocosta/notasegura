import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { ALGORITHMS } from "@/lib/playground";
import AlgoritmosPage, { metadata } from "./page";

afterEach(() => {
  cleanup();
});

function item(name: string) {
  const heading = within(screen.getByRole("list", { name: "Lista de algoritmos" })).getByRole("heading", {
    level: 3,
    name,
  });
  return within(heading.closest("li")!);
}

describe("Algoritmos", () => {
  it("renders the heading and the introduction", () => {
    render(<AlgoritmosPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Algoritmos de criptografia");
    const intro = screen.getByRole("heading", { level: 2, name: "Criptografia, hash e codificação" }).closest("section")!;
    expect(intro.querySelectorAll("p").length).toBeGreaterThanOrEqual(3);
    expect(metadata.title).toBe("Algoritmos de criptografia");
  });

  it("lists the seven algorithms in order", () => {
    render(<AlgoritmosPage />);
    const list = within(screen.getByRole("list", { name: "Lista de algoritmos" }));
    const items = list.getAllByRole("listitem");
    expect(items).toHaveLength(7);
    expect(list.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(ALGORITHMS.map((a) => a.name));
    for (const algorithm of ALGORITHMS) {
      expect(item(algorithm.name).getByRole("link", { name: `Ler sobre ${algorithm.name}` })).toHaveAttribute(
        "href",
        `/algoritmos/${algorithm.id}`,
      );
    }
  });

  it("shows the safety labels", () => {
    render(<AlgoritmosPage />);
    expect(item("Cifra de César").getByText("Inseguro")).toBeInTheDocument();
    expect(item("Base64").getByText("Não é criptografia")).toBeInTheDocument();
    expect(item("AES-256-GCM").getByText("Seguro")).toBeInTheDocument();
  });
});
