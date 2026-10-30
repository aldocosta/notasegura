import type { Metadata } from "next";
import AdsenseScript from "@/components/AdsenseScript";
import { getAdsenseClient } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const client = getAdsenseClient();
  return client ? { other: { "google-adsense-account": client } } : {};
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdsenseScript />
      {children}
    </>
  );
}
