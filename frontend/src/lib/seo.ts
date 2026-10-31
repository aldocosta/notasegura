import type { Metadata } from "next";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

const SITE_DESCRIPTION = "Compartilhamento anônimo de textos criptografados e autodestrutivos.";
const LOCALE = "pt_BR";
const DEFAULT_SHARE_IMAGE = "/opengraph-image";

function shareImages(url: string) {
  return [{ url, width: 1200, height: 630, alt: SITE_NAME }];
}

export function siteMetadata(): Metadata {
  const images = shareImages(DEFAULT_SHARE_IMAGE);
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    openGraph: { siteName: SITE_NAME, locale: LOCALE, type: "website", images },
    twitter: { card: "summary_large_image", images },
  };
}

export function pageMetadata(page: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  const { title, description, path } = page;
  const images = shareImages(page.image ?? DEFAULT_SHARE_IMAGE);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: LOCALE,
      type: page.type ?? "website",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function absoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

function organization() {
  return { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") };
}

export function articleJsonLd(article: {
  path: string;
  headline: string;
  description: string;
  publishedAt: string;
  image: string;
}): Record<string, unknown> {
  const url = absoluteUrl(article.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    inLanguage: "pt-BR",
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(article.image),
    author: organization(),
    publisher: { ...organization(), logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function jsonLdHtml(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
