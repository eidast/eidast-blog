import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticPaths = ["", "/blog", "/about"] as const;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
      });
    }

    const posts = await getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${base}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
      });
    }
  }

  return entries;
}
