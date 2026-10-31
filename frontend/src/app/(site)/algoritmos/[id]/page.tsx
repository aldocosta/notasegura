import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CryptoPlayground from "@/components/CryptoPlayground";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import {
  IconAlert,
  IconFileText,
  IconGlobe,
  IconKey,
  IconLock,
  IconScale,
  IconShield,
  type IconComponent,
} from "@/components/icons";
import { ARTICLES, algorithmHref, articleTitle, findAlgorithm } from "@/lib/algorithms";
import type { ArticleSectionTitle } from "@/lib/algorithms/types";
import { ALGORITHMS } from "@/lib/playground";
import { ALGORITHMS_PATH } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

const SECTION_ICONS: Record<ArticleSectionTitle, IconComponent> = {
  "O que é": IconFileText,
  "Como funciona": IconKey,
  Exemplo: IconLock,
  "Onde é usado": IconGlobe,
  "Pontos fortes e fracos": IconScale,
  "Quando usar": IconAlert,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return ALGORITHMS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const algorithm = findAlgorithm((await params).id);
  if (!algorithm) return {};
  return { title: articleTitle(algorithm), description: ARTICLES[algorithm.id].description };
}

export default async function AlgorithmPage({ params }: Props) {
  const algorithm = findAlgorithm((await params).id);
  if (!algorithm) notFound();

  const article = ARTICLES[algorithm.id];
  const highlights: TrustHighlight[] = [
    { icon: IconFileText, title: algorithm.kind, text: article.highlights.kind },
    { icon: IconShield, title: algorithm.safety, text: article.highlights.safety },
    { icon: IconKey, title: "Chave", text: article.highlights.key },
  ];

  return (
    <TrustPage title={articleTitle(algorithm)} lead={article.lead} icon={IconLock} highlights={highlights}>
      {article.sections.map((section) => (
        <TrustSection key={section.title} title={section.title} icon={SECTION_ICONS[section.title]}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.items && (
            <ul className="list-disc space-y-2 pl-6">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </TrustSection>
      ))}

      <section id="testar-algoritmos">
        <CryptoPlayground initialAlgorithm={algorithm.id} />
      </section>

      <TrustSection title="Veja também" icon={IconGlobe}>
        <ul className="space-y-2">
          {article.related.map((id) => (
            <li key={id}>
              <TextLink href={algorithmHref(id)}>Ler sobre {findAlgorithm(id)!.name}</TextLink>
            </li>
          ))}
          <li>
            <TextLink href={ALGORITHMS_PATH}>Todos os algoritmos</TextLink>
          </li>
        </ul>
      </TrustSection>

      <TrustSection title="Precisa enviar um segredo?" icon={IconShield} tone="mint">
        <p>Use uma nota segura: o texto é criptografado com AES-256-GCM e se apaga sozinho.</p>
        <p>
          <TextLink href="/#criar-nota">Criar uma nota</TextLink>
        </p>
      </TrustSection>
    </TrustPage>
  );
}
