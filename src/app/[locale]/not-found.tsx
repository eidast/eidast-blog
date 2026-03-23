import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function LocaleNotFound() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-pixel text-lg text-[var(--pixel-fg)]">{t("title")}</h1>
      <p className="mt-4 text-[15px] text-[var(--pixel-fg-soft)]">{t("body")}</p>
      <Link
        href="/"
        className="mt-8 inline-block font-pixel text-[10px] text-[var(--pixel-accent)] underline decoration-2 underline-offset-4"
      >
        {t("home")}
      </Link>
    </div>
  );
}
