import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { createNote } from "@/lib/api";
import CryptoPlayground from "./CryptoPlayground";

vi.mock("@/lib/api", () => ({
  createNote: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("@/lib/playground/ed25519", async () => {
  const { AlgorithmUnsupportedError } = await import("@/lib/playground/web-crypto");
  return { encrypt: vi.fn(() => Promise.reject(new AlgorithmUnsupportedError())) };
});

const mockedUsePathname = vi.mocked(usePathname);

beforeEach(() => {
  mockedUsePathname.mockReturnValue("/");
});

const NAMES = [
  "AES-256-GCM",
  "ChaCha20-Poly1305",
  "AES-256-CBC",
  "AES-256-CTR",
  "RSA-OAEP",
  "SHA-256",
  "SHA-512",
  "SHA-1",
  "MD5",
  "HMAC-SHA-256",
  "ECDSA",
  "Ed25519",
  "RSA-PSS",
  "ECDH",
  "PBKDF2",
  "Base64",
  "Hexadecimal",
  "Cifra de César",
  "ROT13",
  "Cifra Atbash",
  "Cifra de Vigenère",
  "Cifra de Playfair",
  "Cerca de trilho",
  "Máquina Enigma",
  "Cifra de Vernam",
];
const PLAYFAIR_NOTE = "A Playfair remove espaços e acentos, troca J por I e insere X entre letras repetidas.";
const ENIGMA_NOTE = "A Enigma só tinha letras maiúsculas.";
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
const ABC_DIGEST = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function algorithmButton(name: string) {
  return within(screen.getByRole("group", { name: "Algoritmos" })).getByRole("button", { name });
}

function typeText(value: string, label = "Texto") {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function encrypt(label = "Encriptar") {
  fireEvent.click(screen.getByRole("button", { name: label }));
}

function explanation() {
  return within(screen.getByRole("heading", { level: 3 }).parentElement!.parentElement!);
}

async function valueOf(label: string) {
  const term = await screen.findByText(label, { selector: "dt" });
  return term.nextElementSibling as HTMLElement;
}

describe("CryptoPlayground", () => {
  it("renders twenty-five buttons with AES-256-GCM pressed", () => {
    render(<CryptoPlayground />);
    const buttons = within(screen.getByRole("group", { name: "Algoritmos" })).getAllByRole("button");
    expect(buttons).toHaveLength(25);
    expect(buttons.map((b) => b.textContent)).toEqual(NAMES);
    const pressed = buttons.filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveTextContent("AES-256-GCM");
  });

  it("switches the explanation", () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Cifra de César"));
    expect(algorithmButton("Cifra de César")).toHaveAttribute("aria-pressed", "true");
    expect(explanation().getByText("Cifra clássica")).toBeInTheDocument();
    expect(explanation().getByText("Inseguro")).toBeInTheDocument();
    expect(screen.getByLabelText("Deslocamento")).toBeInTheDocument();

    fireEvent.click(algorithmButton("Base64"));
    expect(explanation().getByText("Codificação")).toBeInTheDocument();
    expect(explanation().getByText("Não é criptografia")).toBeInTheDocument();
    expect(screen.queryByLabelText("Deslocamento")).toBeNull();
  });

  it("shows the fields of each classic cipher", () => {
    render(<CryptoPlayground />);
    for (const name of NAMES) {
      fireEvent.click(algorithmButton(name));
      const start = screen.queryByLabelText("Posição inicial");
      const rails = screen.queryByLabelText("Trilhos");
      const keyword = screen.queryByLabelText("Palavra-chave");
      if (name === "Máquina Enigma") {
        expect(start, name).toHaveValue("AAA");
      } else {
        expect(start, name).toBeNull();
      }
      if (name === "Cerca de trilho") {
        expect(rails, name).toHaveValue(3);
      } else {
        expect(rails, name).toBeNull();
      }
      if (name === "Cifra de Vigenère" || name === "Cifra de Playfair") {
        expect(keyword, name).toBeInTheDocument();
      } else {
        expect(keyword, name).toBeNull();
      }
    }
  });

  it("shows the Playfair note", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Cifra de Playfair"));
    fireEvent.change(screen.getByLabelText("Palavra-chave"), { target: { value: "PLAYFAIREXAMPLE" } });
    typeText("Hide the gold in the tree stump");
    encrypt();
    expect(await valueOf("Resultado")).toHaveTextContent("BMODZBXDNABEKUDMUIXMMOUVIF");
    expect(screen.queryByText(PLAYFAIR_NOTE)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Decifrar" }));
    expect(await valueOf("Texto decifrado")).toHaveTextContent("HIDETHEGOLDINTHETREXESTUMP");
    expect(screen.getByText(PLAYFAIR_NOTE)).toBeInTheDocument();
  });

  it("encrypts with the Enigma", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Máquina Enigma"));
    typeText("AAAAA");
    encrypt();
    expect(await valueOf("Resultado")).toHaveTextContent("BDZGO");
    fireEvent.click(screen.getByRole("button", { name: "Decifrar" }));
    expect(await valueOf("Texto decifrado")).toHaveTextContent("AAAAA");
    expect(screen.getByText(ENIGMA_NOTE)).toBeInTheDocument();
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
    encrypt("Gerar hash");
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
    encrypt("Codificar");
    expect(await valueOf("Resultado")).toHaveTextContent("b2zDoQ==");
    fireEvent.click(algorithmButton("SHA-256"));
    expect(screen.queryByText("Resultado")).toBeNull();
    expect(screen.getByLabelText("Texto")).toHaveValue("olá");
  });

  it("announces the result", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Base64"));
    typeText("olá");
    encrypt("Codificar");
    const term = await screen.findByText("Resultado", { selector: "dt" });
    expect(term.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
  });

  it("does not call the API", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Base64"));
    typeText("olá");
    encrypt("Codificar");
    await valueOf("Resultado");
    expect(createNote).not.toHaveBeenCalled();
  });

  it("links to the page of the selected algorithm", () => {
    render(<CryptoPlayground />);
    expect(screen.getByRole("link", { name: "Saiba mais sobre AES-256-GCM" })).toHaveAttribute(
      "href",
      "/algoritmos/aes-gcm",
    );
    fireEvent.click(algorithmButton("Cifra de César"));
    expect(screen.getByRole("link", { name: "Saiba mais sobre Cifra de César" })).toHaveAttribute(
      "href",
      "/algoritmos/cesar",
    );
  });

  it("links to all algorithms", () => {
    render(<CryptoPlayground />);
    expect(screen.getByRole("link", { name: "Ver todos os algoritmos" })).toHaveAttribute("href", "/algoritmos");
  });

  it("starts with the given algorithm", () => {
    render(<CryptoPlayground initialAlgorithm="vigenere" />);
    expect(algorithmButton("Cifra de Vigenère")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Palavra-chave")).toBeInTheDocument();
  });

  it("does not link to the current page", () => {
    mockedUsePathname.mockReturnValue("/algoritmos/cesar");
    render(<CryptoPlayground initialAlgorithm="cesar" />);
    expect(screen.queryByRole("link", { name: "Saiba mais sobre Cifra de César" })).toBeNull();
    fireEvent.click(algorithmButton("Base64"));
    expect(screen.getByRole("link", { name: "Saiba mais sobre Base64" })).toHaveAttribute(
      "href",
      "/algoritmos/base64",
    );
  });

  it("shows PSS for RSA-OAEP", () => {
    const { container } = render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("RSA-OAEP"));
    expect(container.textContent).toContain("PSS");
  });

  it("groups the buttons by category", () => {
    render(<CryptoPlayground />);
    const outer = within(screen.getByRole("group", { name: "Algoritmos" }));
    const groups = outer.getAllByRole("group");
    expect(groups.map((g) => g.getAttribute("aria-label"))).toEqual(CATEGORIES.map(([name]) => name));
    for (const [i, [name, members]] of CATEGORIES.entries()) {
      expect(
        within(groups[i])
          .getAllByRole("button")
          .map((b) => b.textContent),
        name,
      ).toEqual(members);
    }
  });

  it("labels the action by type", () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("ECDSA"));
    expect(screen.getByRole("button", { name: "Assinar" })).toBeInTheDocument();
    fireEvent.click(algorithmButton("HMAC-SHA-256"));
    expect(screen.getByRole("button", { name: "Gerar código" })).toBeInTheDocument();
    fireEvent.click(algorithmButton("PBKDF2"));
    expect(screen.getByRole("button", { name: "Derivar chave" })).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.queryByLabelText("Texto")).toBeNull();
  });

  it("verifies a changed text as invalid", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("HMAC-SHA-256"));
    typeText("segredo");
    encrypt("Gerar código");
    await valueOf("Resultado");
    const box = screen.getByLabelText("Texto para verificar");
    expect(box).toHaveValue("segredo");
    fireEvent.click(screen.getByRole("button", { name: "Verificar" }));
    expect(await screen.findByText("Válido: o texto confere com o resultado.")).toBeInTheDocument();
    fireEvent.change(box, { target: { value: "segredO" } });
    fireEvent.click(screen.getByRole("button", { name: "Verificar" }));
    expect(await screen.findByText("Inválido: o texto não confere com o resultado.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Decifrar" })).toBeNull();
  });

  it("shows the same ECDH secret on both sides", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("ECDH"));
    typeText("segredo");
    encrypt();
    const ana = await valueOf("Segredo calculado por Ana");
    const beto = await valueOf("Segredo calculado por Beto");
    expect(ana.textContent).toBe(beto.textContent);
    fireEvent.click(screen.getByRole("button", { name: "Decifrar" }));
    expect(await valueOf("Texto decifrado")).toHaveTextContent("segredo");
  });

  it("shows the unsupported message", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Ed25519"));
    typeText("segredo");
    encrypt("Assinar");
    expect(await screen.findByRole("alert")).toHaveTextContent("Seu navegador não permite este algoritmo.");
    expect(screen.queryByText("Resultado")).toBeNull();
  });

  it("decodes Base64", async () => {
    render(<CryptoPlayground />);
    fireEvent.click(algorithmButton("Base64"));
    typeText("olá");
    encrypt("Codificar");
    await valueOf("Resultado");
    fireEvent.click(screen.getByRole("button", { name: "Decodificar" }));
    expect(await valueOf("Texto decodificado")).toHaveTextContent("olá");
  });
});
