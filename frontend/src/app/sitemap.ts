import type { MetadataRoute } from "next";
import { algorithmHref } from "@/lib/algorithms/href";
import { ALGORITHMS } from "@/lib/playground";
import { ALGORITHMS_PATH, TRUST_PAGES, getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const paths = [...TRUST_PAGES.map((page) => page.href), ALGORITHMS_PATH, ...ALGORITHMS.map((a) => algorithmHref(a.id))];
  return [{ url: siteUrl }, ...paths.map((path) => ({ url: `${siteUrl}${path}` }))];
}
