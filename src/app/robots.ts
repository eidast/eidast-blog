import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

/** Use runtime `SITE_URL` on Cloud Run without rebuilding the image. */
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
