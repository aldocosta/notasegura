import type { AlgorithmId } from "@/lib/playground/types";

export type GuideKind = "Comparação" | "Guia prático";

export const COMPARISON_SECTION_TITLES = [
  "Resumo",
  "Como cada um funciona",
  "Comparação lado a lado",
  "Quando escolher cada um",
  "Conclusão",
] as const;

export type GuideTable = { caption: string; columns: string[]; rows: string[][] };

export type GuideSection = { title: string; paragraphs: string[]; items?: string[]; table?: GuideTable };

export type GuideHighlight = { title: string; text: string };

export type Guide = {
  slug: string;
  kind: GuideKind;
  title: string;
  description: string;
  lead: string;
  highlights: [GuideHighlight, GuideHighlight, GuideHighlight];
  sections: GuideSection[];
  algorithms: AlgorithmId[];
  related: [string, string];
  publishedAt: string;
};
