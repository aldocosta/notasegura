import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { createNote } from "@/lib/api";
import CryptoPlayground from "./CryptoPlayground";

vi.mock("@/lib/api", () => ({
  createNote: vi.fn(),
}));

const NAMES = [
  "AES-256-GCM",
  "AES-256-CBC",
  "RSA-OAEP",
  "SHA-256",
  "Base64",
  "Cifra de César",
  "Cifra de Vigenère",
];
const ABC_DIGEST = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function algorithmButton(name: string) {
  return within(screen.getByRole("group", { name: "Algoritmos" })).getByRole("button", { name });
}

function typeText(value: string) {
  fireEvent.change(screen.getByLabelText("Texto para encriptar"), { target: { value } });
}

function encrypt() {
  fireEvent.click(screen.getByRole("button", { name: "Encriptar" }));
}

async function valueOf(label: string) {
  const term = await screen.findByText(label, { selector: "dt" });
  return term.nextElementSibling as HTMLElement;
}

describe("CryptoPlayground", () => {
  it("renders seven buttons with AES-256-GCM pressed", () => {
    render(<CryptoPlayground />);
    const buttons = within(screen.getByRole("group", { name: "Algoritmos" })).getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(NAMES);
    const pressed = buttons.filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveTextContent("AES-256-GCM");
  });

  it("switches the explanation", () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Cifra de César"));
    expect(algorithmButton("Cifra de César")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Cifra clássica")).toBeInTheDocument();
    expect(screen.getByText("Inseguro")).toBeInTheDocument();
    expect(screen.getByLabelText("Deslocamento")).toBeInTheDocument();

    fireEvent.click(algorithmButton("Base64"));
    expect(screen.getByText("Codificação")).toBeInTheDocument();
    expect(screen.getByText("Não é criptografia")).toBeInTheDocument();
    expect(screen.queryByLabelText("Deslocamento")).toBeNull();
  });

  it("shows the keyword field only for Vigenère", () => {
    render(<CryptoPlayground />);
    for (const name of NAMES) {
      fireEvent.click(algorithmButton(name));
      const field = screen.queryByLabelText("Palavra-chave");
      if (name === "Cifra de Vigenère") {
        expect(field, name).toBeInTheDocument();
      } else {
        expect(field, name).toBeNull();
      }
    }
  });

  it("encrypts and decrypts with César", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Cifra de César"));
    typeText("Abc, xyz!");
    encrypt();
    expect(await valueOf("Resultado")).toHaveTextContent("Def, abc!");
    fireEvent.click(screen.getByRole("button", { name: "Decifrar" }));
    expect(await valueOf("Texto decifrado")).toHaveTextContent("Abc, xyz!");
  });

  it("hides Decifrar for SHA-256", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("SHA-256"));
    typeText("abc");
    encrypt();
    expect(await valueOf("Resultado")).toHaveTextContent(ABC_DIGEST);
    expect(screen.queryByRole("button", { name: "Decifrar" })).toBeNull();
    expect(screen.getByText(/Um hash não pode ser desfeito/)).toBeInTheDocument();
  });

  it("shows an error for empty text", () => {
    render(<CryptoPlayground />);
    encrypt();
    expect(screen.getByRole("alert")).toHaveTextContent(/\S/);
    expect(screen.queryByText("Resultado")).toBeNull();
  });

  it("clears the result when the algorithm changes", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Base64"));
    typeText("olá");
    encrypt();
    expect(await valueOf("Resultado")).toHaveTextContent("b2zDoQ==");
    fireEvent.click(algorithmButton("SHA-256"));
    expect(screen.queryByText("Resultado")).toBeNull();
    expect(screen.getByLabelText("Texto para encriptar")).toHaveValue("olá");
  });

  it("announces the result", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Base64"));
    typeText("olá");
    encrypt();
    const term = await screen.findByText("Resultado", { selector: "dt" });
    expect(term.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
  });

  it("does not call the API", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Base64"));
    typeText("olá");
    encrypt();
    await valueOf("Resultado");
    expect(createNote).not.toHaveBeenCalled();
  });
});
