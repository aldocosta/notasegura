import { describe, expect, it } from "vitest";
import { actionLabels } from "./actions";

describe("actionLabels", () => {
  it("labels each kind", () => {
    for (const kind of ["Criptografia simétrica", "Criptografia assimétrica", "Troca de chaves", "Cifra clássica"] as const) {
      expect(actionLabels(kind), kind).toEqual({
        run: "Encriptar",
        running: "Encriptando...",
        back: "Decifrar",
        backResult: "Texto decifrado",
        input: "Texto",
      });
    }
    expect(actionLabels("Hash")).toEqual({ run: "Gerar hash", running: "Gerando...", input: "Texto" });
    expect(actionLabels("Codificação")).toEqual({
      run: "Codificar",
      running: "Codificando...",
      back: "Decodificar",
      backResult: "Texto decodificado",
      input: "Texto",
    });
    expect(actionLabels("Autenticação de mensagem")).toEqual({
      run: "Gerar código",
      running: "Gerando...",
      back: "Verificar",
      input: "Texto",
    });
    expect(actionLabels("Assinatura digital")).toEqual({
      run: "Assinar",
      running: "Assinando...",
      back: "Verificar",
      input: "Texto",
    });
    expect(actionLabels("Derivação de chave")).toEqual({
      run: "Derivar chave",
      running: "Derivando...",
      back: "Verificar",
      input: "Senha",
    });
  });
});
