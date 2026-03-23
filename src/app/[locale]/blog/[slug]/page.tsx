import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { createMdxComponents } from "@/components/mdx-components";
import { getAllPosts, getPostBySlug, postExists } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale);
    for (const p of posts) {
      out.push({ locale, slug: p.slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale as Locale, slug);
  if (!post) {
    return { title: "Not found" };
  }

  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  if (await postExists("en", slug)) {
    languages.en = `${base}/en/blog/${slug}`;
  }
  if (await postExists("es", slug)) {
    languages.es = `${base}/es/blog/${slug}`;
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${base}/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      locale: locale === "es" ? "es" : "en",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(locale as Locale, slug);
  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale: locale as Locale, namespace: "Post" });
  const components = createMdxComponents();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="font-pixel text-[10px] text-[var(--pixel-accent)] hover:text-[var(--pixel-accent-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
      >
        {t("backToBlog")}
      </Link>

      <header className="mt-6 border-b-2 border-[var(--pixel-border)] pb-8">
        <time
          dateTime={post.date}
          className="font-pixel text-[10px] text-[var(--pixel-muted)]"
        >
          {post.date}
        </time>
        <h1 className="mt-3 font-pixel text-lg leading-snug text-[var(--pixel-fg)] sm:text-xl">
          {post.title}
        </h1>
        <p className="mt-4 text-[15px] text-[var(--pixel-fg-soft)]">{post.description}</p>
        {post.tags.length > 0 ? (
          <p className="mt-6 font-pixel text-[9px] text-[var(--pixel-muted)]">
            {t("tags")}:{" "}
            {post.tags.map((tag) => (
              <span key={tag} className="mr-2 text-[var(--pixel-accent)]">
                #{tag}
              </span>
            ))}
          </p>
        ) : null}
      </header>

      <div className="prose-pixel pt-10">
        <MDXRemote source={post.body} components={components} />
      </div>
    </article>
  );
}
