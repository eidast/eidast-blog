function normalizeBase(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Public site URL for metadata, sitemap, and robots.
 * - `SITE_URL`: runtime (Cloud Run / Node) — preferred on containers.
 * - `NEXT_PUBLIC_*`: baked in at build time (Docker build-arg / CI).
 */
export function getSiteUrl(): string {
  if (process.env.SITE_URL) {
    return normalizeBase(process.env.SITE_URL);
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeBase(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_URL) {
    return normalizeBase(`https://${process.env.VERCEL_URL}`);
  }
  return "http://localhost:3000";
}
