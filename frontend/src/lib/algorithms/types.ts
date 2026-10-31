import type { AlgorithmId } from "@/lib/playground/types";

export const ARTICLE_SECTION_TITLES = [
  "O que é",
  "Como funciona",
  "Exemplo",
  "Onde é usado",
  "Pontos fortes e fracos",
  "Quando usar",
] as const;

export type ArticleSectionTitle = (typeof ARTICLE_SECTION_TITLES)[number];

export type ArticleSection = { title: ArticleSectionTitle; paragraphs: string[]; items?: string[] };

export type Article = {
  id: AlgorithmId;
  description: string;
  lead: string;
  highlights: { kind: string; safety: string; key: string };
  sections: ArticleSection[];
  related: [AlgorithmId, AlgorithmId];
  publishedAt: string;
};
