import { notFound } from "next/navigation";
import { findAlgorithm } from "@/lib/algorithms";
import { ALGORITHMS } from "@/lib/playground";
import { shareImage } from "@/lib/share-image";

export const alt = "Nota Segura - BR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ALGORITHMS.map((a) => ({ id: a.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const algorithm = findAlgorithm((await params).id);
  if (!algorithm) notFound();
  return shareImage({ eyebrow: algorithm.kind, title: algorithm.name });
}
