import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { PixelCard } from "@/components/PixelCard";
import { PostPixelPreview } from "@/components/PostPixelPreview";
import { PostTagChips } from "@/components/PostTagChips";
import { getAllPosts } from "@/lib/posts";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale: locale as Locale, namespace: "HomePage" });
  const posts = await getAllPosts(locale as Locale);
  const latest = posts.slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PixelCard className="p-6 sm:p-8">
        <h1 className="font-pixel text-lg leading-snug text-[var(--pixel-fg)] sm:text-xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--pixel-fg-soft)]">
          {t("subtitle")}
        </p>
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-block border-2 border-[var(--pixel-border)] bg-[var(--pixel-accent)] px-4 py-2 font-pixel text-[10px] text-[var(--pixel-bg)] shadow-[3px_3px_0_0_var(--pixel-shadow)] hover:bg-[var(--pixel-accent-dim)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pixel-accent)]"
          >
            {t("readBlog")}
          </Link>
        </div>
      </PixelCard>

      {latest.length > 0 ? (
        <section className="mt-12" aria-labelledby="latest-heading">
          <h2
            id="latest-heading"
            className="font-pixel mb-6 text-sm text-[var(--pixel-muted)]"
          >
            {t("latestHeading")}
          </h2>
          <ul className="space-y-4">
            {latest.map((post) => (
              <li key={post.slug}>
                <PixelCard className="p-4 transition-transform hover:-translate-y-0.5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-start gap-4 focus-visible:outline-none"
                  >
                    <PostPixelPreview seed={post.slug} className="shrink-0" />
                    <div>
                      <span className="font-pixel text-xs text-[var(--pixel-accent)]">
                        {post.date}
                      </span>
                      <h3 className="mt-1 text-base font-medium text-[var(--pixel-fg)]">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--pixel-fg-soft)]">
                        {post.description}
                      </p>
                      <PostTagChips tags={post.tags} />
                    </div>
                  </Link>
                </PixelCard>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
