import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const DISALLOWED = ["/n/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOWED },
      { userAgent: "Mediapartners-Google", allow: "/", disallow: DISALLOWED },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
