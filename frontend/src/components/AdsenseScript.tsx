import { getAdsenseClient } from "@/lib/site";

export default function AdsenseScript() {
  const client = getAdsenseClient();
  if (!client) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
