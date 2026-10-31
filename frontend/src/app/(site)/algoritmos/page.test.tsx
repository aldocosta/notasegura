import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { ALGORITHMS } from "@/lib/playground";
import AlgoritmosPage, { metadata } from "./page";

const CATEGORIES: Array<[string, string[]]> = [
  ["Criptografia", ["AES-256-GCM", "ChaCha20-Poly1305", "AES-256-CBC", "AES-256-CTR", "RSA-OAEP"]],
  ["Hash", ["SHA-256", "SHA-512", "SHA-1", "MD5"]],
  ["Autenticação e assinatura", ["HMAC-SHA-256", "ECDSA", "Ed25519", "RSA-PSS"]],
  ["Troca e derivação de chaves", ["ECDH", "PBKDF2"]],
  ["Codificação", ["Base64", "Hexadecimal"]],
  [
    "Cifras clássicas",
    [
      "Cifra de César",
      "ROT13",
      "Cifra Atbash",
      "Cifra de Vigenère",
      "Cifra de Playfair",
      "Cerca de trilho",
      "Máquina Enigma",
      "Cifra de Vernam",
    ],
  ],
];

afterEach(() => {
  cleanup();
});

function item(name: string) {
  return within(screen.getByRole("heading", { level: 4, name }).closest("li")!);
}

describe("Algoritmos", () => {
  it("renders the heading and the introduction", () => {
    render(<AlgoritmosPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Algoritmos de criptografia");
    const intro = screen.getByRole("heading", { level: 2, name: "Criptografia, hash e codificação" }).closest("section")!;
    expect(intro.querySelectorAll("p").length).toBeGreaterThanOrEqual(4);
    expect(metadata.title).toBe("Algoritmos de criptografia");
    expect(metadata.alternates?.canonical).toBe("/algoritmos");
  });

  it("links the guides", () => {
    render(<AlgoritmosPage />);
    expect(screen.getByRole("link", { name: "Ver todos os guias" })).toHaveAttribute("href", "/guias");
  });

  it("lists the algorithms by category", () => {
    render(<AlgoritmosPage />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(
      CATEGORIES.map(([name]) => name),
    );
    for (const [category, names] of CATEGORIES) {
      const list = within(screen.getByRole("list", { name: category }));
      expect(list.getAllByRole("heading", { level: 4 }).map((h) => h.textContent), category).toEqual(names);
    }
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
    expect(item("MD5").getByText("Inseguro")).toBeInTheDocument();
  });

  it("describes the classic ciphers correctly", () => {
    render(<AlgoritmosPage />);
    const classic = screen.getByText(/^As cifras clássicas/);
    expect(classic.textContent).not.toContain("em segundos");
    expect(classic.textContent).toContain("Vernam");
  });
});
