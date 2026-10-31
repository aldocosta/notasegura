import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CreateNoteCallout from "@/components/CreateNoteCallout";
import CryptoPlayground from "@/components/CryptoPlayground";
import JsonLd from "@/components/JsonLd";
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
import { guideHref, guidesFor } from "@/lib/guides";
import { ALGORITHMS } from "@/lib/playground";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
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
  const path = algorithmHref(algorithm.id);
  return pageMetadata({
    title: articleTitle(algorithm),
    description: ARTICLES[algorithm.id].description,
    path,
    type: "article",
    image: `${path}/opengraph-image`,
  });
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
  const path = algorithmHref(algorithm.id);
  const title = articleTitle(algorithm);

  return (
    <TrustPage
      title={title}
      lead={article.lead}
      icon={IconLock}
      breadcrumb={[
        { name: "Início", href: "/" },
        { name: "Algoritmos", href: ALGORITHMS_PATH },
        { name: algorithm.name },
      ]}
      highlights={highlights}
    >
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
          {guidesFor(algorithm.id).map((guide) => (
            <li key={guide.slug}>
              <TextLink href={guideHref(guide.slug)}>Ler o guia: {guide.title}</TextLink>
            </li>
          ))}
          <li>
            <TextLink href={ALGORITHMS_PATH}>Todos os algoritmos</TextLink>
          </li>
        </ul>
      </TrustSection>

      <CreateNoteCallout />

      <JsonLd
        data={articleJsonLd({
          path,
          headline: title,
          description: article.description,
          publishedAt: article.publishedAt,
          image: `${path}/opengraph-image`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Algoritmos", path: ALGORITHMS_PATH },
          { name: algorithm.name, path },
        ])}
      />
    </TrustPage>
  );
}
