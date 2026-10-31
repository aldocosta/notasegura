import { notFound } from "next/navigation";
import { GUIDES, findGuide } from "@/lib/guides";
import { shareImage } from "@/lib/share-image";

export const alt = "Nota Segura - BR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  return shareImage({ eyebrow: guide.kind, title: guide.title });
}
