import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { PixelCard } from "@/components/PixelCard";
import { PostPixelPreview } from "@/components/PostPixelPreview";
import { PostTagChips } from "@/components/PostTagChips";
import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "BlogPage" });
  const base = getSiteUrl();

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${base}/${locale}/blog`,
      languages: {
        en: `${base}/en/blog`,
        es: `${base}/es/blog`,
      },
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: "BlogPage" });
  const posts = await getAllPosts(locale as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="font-pixel text-xl text-[var(--pixel-fg)]">{t("title")}</h1>
        <p className="mt-2 text-[15px] text-[var(--pixel-fg-soft)]">{t("description")}</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--pixel-muted)]">{t("empty")}</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <PixelCard className="p-5 transition-transform hover:-translate-y-0.5">
                <article className="flex items-start gap-4">
                  <PostPixelPreview seed={post.slug} className="shrink-0" />
                  <div>
                    <time
                      dateTime={post.date}
                      className="font-pixel text-[10px] text-[var(--pixel-accent)]"
                    >
                      {post.date}
                    </time>
                    <h2 className="mt-2 text-lg font-medium text-[var(--pixel-fg)]">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-[var(--pixel-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm text-[var(--pixel-fg-soft)]">{post.description}</p>
                    <PostTagChips tags={post.tags} />
                    <p className="mt-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-pixel text-[10px] text-[var(--pixel-accent)] underline decoration-2 underline-offset-2"
                      >
                        {t("readMore")} →
                      </Link>
                    </p>
                  </div>
                </article>
              </PixelCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
