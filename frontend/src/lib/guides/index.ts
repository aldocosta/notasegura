import type { AlgorithmId } from "@/lib/playground/types";
import { aesGcmOuChacha20Poly1305 } from "./articles/aes-gcm-ou-chacha20-poly1305";
import { comoEnviarUmaSenhaComSeguranca } from "./articles/como-enviar-uma-senha-com-seguranca";
import { comoGuardarSenhas } from "./articles/como-guardar-senhas";
import { criptografiaHashOuCodificacao } from "./articles/criptografia-hash-ou-codificacao";
import { oQueECriptografiaDePontaAPonta } from "./articles/o-que-e-criptografia-de-ponta-a-ponta";
import { oQueEUmaNotaAutodestrutiva } from "./articles/o-que-e-uma-nota-autodestrutiva";
import { rsaOuCurvasElipticas } from "./articles/rsa-ou-curvas-elipticas";
import { sha256Sha1OuMd5 } from "./articles/sha-256-sha-1-ou-md5";
import type { Guide } from "./types";

export { GUIDES_PATH, guideHref } from "./href";

const MAX_GUIDES_PER_ALGORITHM = 3;

export const GUIDES: Guide[] = [
  aesGcmOuChacha20Poly1305,
  sha256Sha1OuMd5,
  criptografiaHashOuCodificacao,
  rsaOuCurvasElipticas,
  comoEnviarUmaSenhaComSeguranca,
  oQueEUmaNotaAutodestrutiva,
  oQueECriptografiaDePontaAPonta,
  comoGuardarSenhas,
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guidesFor(id: AlgorithmId): Guide[] {
  return GUIDES.filter((g) => g.algorithms.includes(id)).slice(0, MAX_GUIDES_PER_ALGORITHM);
}

export function guideText(guide: Guide): string[] {
  return [
    guide.lead,
    ...guide.highlights.map((h) => h.text),
    ...guide.sections.flatMap((s) => [
      ...s.paragraphs,
      ...(s.items ?? []),
      ...(s.table ? [s.table.caption, ...s.table.columns, ...s.table.rows.flat()] : []),
    ]),
  ];
}

export function guideWordCount(guide: Guide): number {
  return guideText(guide).reduce((total, text) => total + text.split(/\s+/).filter(Boolean).length, 0);
}
