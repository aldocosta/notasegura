import type { MetadataRoute } from "next";
import { TRUST_PAGES, getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return [{ url: siteUrl }, ...TRUST_PAGES.map((page) => ({ url: `${siteUrl}${page.href}` }))];
}
