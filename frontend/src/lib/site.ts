import { GUIDES_PATH } from "@/lib/guides/href";

export { GUIDES_PATH };

const DEFAULT_SITE_URL = "http://localhost:3005";
const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{16}$/;

export const SITE_NAME = "Nota Segura - BR";
export const POLICY_UPDATED_AT = "30 de outubro de 2026";

export const TRUST_PAGES = [
  { href: "/sobre", label: "Sobre" },
  { href: "/privacidade", label: "Privacidade e Termos" },
  { href: "/contato", label: "Contato" },
] as const;

export const ALGORITHMS_PATH = "/algoritmos";

export const NAV_LINKS = [
  { href: ALGORITHMS_PATH, label: "Algoritmos" },
  { href: GUIDES_PATH, label: "Guias" },
  ...TRUST_PAGES,
] as const;

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return url ? url.replace(/\/+$/, "") : DEFAULT_SITE_URL;
}

export function getAdsenseClient(): string | null {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
  return ADSENSE_CLIENT_PATTERN.test(client) ? client : null;
}

export function getAdsensePublisherId(): string | null {
  const client = getAdsenseClient();
  return client ? client.replace(/^ca-/, "") : null;
}

export function getContactEmail(): string | null {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return email ? email : null;
}
