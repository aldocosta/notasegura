import type { AlgorithmKind } from "./types";

export type ActionLabels = {
  run: string;
  running: string;
  back?: string;
  backResult?: string;
  input: string;
};

const ENCRYPT: ActionLabels = {
  run: "Encriptar",
  running: "Encriptando...",
  back: "Decifrar",
  backResult: "Texto decifrado",
  input: "Texto",
};

const ACTIONS: Record<AlgorithmKind, ActionLabels> = {
  "Criptografia simétrica": ENCRYPT,
  "Criptografia assimétrica": ENCRYPT,
  "Troca de chaves": ENCRYPT,
  "Cifra clássica": ENCRYPT,
  Hash: { run: "Gerar hash", running: "Gerando...", input: "Texto" },
  Codificação: {
    run: "Codificar",
    running: "Codificando...",
    back: "Decodificar",
    backResult: "Texto decodificado",
    input: "Texto",
  },
  "Autenticação de mensagem": { run: "Gerar código", running: "Gerando...", back: "Verificar", input: "Texto" },
  "Assinatura digital": { run: "Assinar", running: "Assinando...", back: "Verificar", input: "Texto" },
  "Derivação de chave": { run: "Derivar chave", running: "Derivando...", back: "Verificar", input: "Senha" },
};

export function actionLabels(kind: AlgorithmKind): ActionLabels {
  return ACTIONS[kind];
}
