import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CreateNoteCallout from "@/components/CreateNoteCallout";
import JsonLd from "@/components/JsonLd";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import {
  IconAlert,
  IconClock,
  IconFileText,
  IconGlobe,
  IconKey,
  IconLock,
  IconScale,
  IconShield,
} from "@/components/icons";
import { algorithmHref, findAlgorithm } from "@/lib/algorithms";
import { GUIDES, GUIDES_PATH, findGuide, guideHref } from "@/lib/guides";
import type { GuideTable } from "@/lib/guides/types";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const SECTION_ICONS = [IconFileText, IconKey, IconScale, IconGlobe, IconLock, IconAlert, IconShield, IconClock];
const HIGHLIGHT_ICONS = [IconFileText, IconShield, IconKey];
const CELL = "border border-hairline-strong p-2";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  const path = guideHref(guide.slug);
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path,
    type: "article",
    image: `${path}/opengraph-image`,
  });
}

function Table({ table }: { table: GuideTable }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="mb-2 text-left font-bold text-ink">{table.caption}</caption>
        <thead className="bg-mint-50">
          <tr>
            {table.columns.map((column) => (
              <th key={column} scope="col" className={`${CELL} font-bold text-ink`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map(([label, ...cells]) => (
            <tr key={label}>
              <th scope="row" className={`${CELL} font-bold text-ink`}>
                {label}
              </th>
              {cells.map((cell, i) => (
                <td key={i} className={CELL}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function GuidePage({ params }: Props) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();

  const path = guideHref(guide.slug);
  const highlights: TrustHighlight[] = guide.highlights.map((highlight, i) => ({
    icon: HIGHLIGHT_ICONS[i],
    ...highlight,
  }));
  const breadcrumb = [
    { name: "Início", path: "/" },
    { name: "Guias", path: GUIDES_PATH },
    { name: guide.title, path },
  ];

  return (
    <TrustPage
      title={guide.title}
      lead={guide.lead}
      icon={guide.kind === "Comparação" ? IconScale : IconShield}
      breadcrumb={[
        { name: "Início", href: "/" },
        { name: "Guias", href: GUIDES_PATH },
        { name: guide.title },
      ]}
      highlights={highlights}
    >
      {guide.sections.map((section, i) => (
        <TrustSection key={section.title} title={section.title} icon={SECTION_ICONS[i % SECTION_ICONS.length]}>
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
          {section.table && <Table table={section.table} />}
        </TrustSection>
      ))}

      <TrustSection title="Algoritmos citados" icon={IconKey}>
        <ul className="space-y-2">
          {guide.algorithms.map((id) => (
            <li key={id}>
              <TextLink href={algorithmHref(id)}>Ler sobre {findAlgorithm(id)!.name}</TextLink>
            </li>
          ))}
        </ul>
      </TrustSection>

      <TrustSection title="Outros guias" icon={IconGlobe}>
        <ul className="space-y-2">
          {guide.related.map((slug) => (
            <li key={slug}>
              <TextLink href={guideHref(slug)}>{findGuide(slug)!.title}</TextLink>
            </li>
          ))}
          <li>
            <TextLink href={GUIDES_PATH}>Todos os guias</TextLink>
          </li>
        </ul>
      </TrustSection>

      <CreateNoteCallout />

      <JsonLd
        data={articleJsonLd({
          path,
          headline: guide.title,
          description: guide.description,
          publishedAt: guide.publishedAt,
          image: `${path}/opengraph-image`,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
    </TrustPage>
  );
}
