import { getAdsensePublisherId } from "@/lib/site";

const GOOGLE_CERTIFICATION_AUTHORITY_ID = "f08c47fec0942fa0";

export function GET(): Response {
  const publisherId = getAdsensePublisherId();
  if (!publisherId) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(`google.com, ${publisherId}, DIRECT, ${GOOGLE_CERTIFICATION_AUTHORITY_ID}\n`, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
