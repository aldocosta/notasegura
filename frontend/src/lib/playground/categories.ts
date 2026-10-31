import { ALGORITHMS } from "./index";
import type { Algorithm, AlgorithmKind } from "./types";

export const CATEGORIES: readonly { name: string; kinds: readonly AlgorithmKind[] }[] = [
  { name: "Criptografia", kinds: ["Criptografia simétrica", "Criptografia assimétrica"] },
  { name: "Hash", kinds: ["Hash"] },
  { name: "Autenticação e assinatura", kinds: ["Autenticação de mensagem", "Assinatura digital"] },
  { name: "Troca e derivação de chaves", kinds: ["Troca de chaves", "Derivação de chave"] },
  { name: "Codificação", kinds: ["Codificação"] },
  { name: "Cifras clássicas", kinds: ["Cifra clássica"] },
];

export function algorithmsByCategory(algorithms: Algorithm[] = ALGORITHMS): { name: string; algorithms: Algorithm[] }[] {
  return CATEGORIES.map((category) => ({
    name: category.name,
    algorithms: algorithms.filter((a) => category.kinds.includes(a.kind)),
  })).filter((category) => category.algorithms.length > 0);
}
