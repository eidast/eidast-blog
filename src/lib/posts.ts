import "server-only";

import fs from "fs/promises";
import path from "path";

import matter from "gray-matter";

import type { Locale } from "@/i18n/routing";
import { postFrontmatterSchema } from "@/lib/post-schema";

const contentDir = path.join(process.cwd(), "content");

export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  tags: string[];
  body: string;
};

async function listSlugs(locale: Locale): Promise<string[]> {
  const dir = path.join(contentDir, locale);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function postExists(locale: Locale, slug: string): Promise<boolean> {
  const slugs = await listSlugs(locale);
  return slugs.includes(slug);
}

export async function getAllPosts(locale: Locale): Promise<Post[]> {
  const slugs = await listSlugs(locale);
  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(locale, slug)),
  );
  const valid = posts.filter((p): p is Post => p !== null);
  return valid.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPostBySlug(
  locale: Locale,
  slug: string,
): Promise<Post | null> {
  const filePath = path.join(contentDir, locale, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const parsed = postFrontmatterSchema.safeParse({ ...data, locale });

  if (!parsed.success) {
    console.error(`Invalid frontmatter for ${locale}/${slug}.mdx`, parsed.error);
    return null;
  }

  const resolvedSlug = parsed.data.slug ?? slug;

  return {
    slug: resolvedSlug,
    locale,
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    tags: parsed.data.tags,
    body: content,
  };
}
