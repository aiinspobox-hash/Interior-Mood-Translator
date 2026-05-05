import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import {
  getGuideArticleBySlug,
  GUIDE_ARTICLES_ZH,
} from "@/content/guideArticles";
import { pickStrings } from "@/lib/i18n/dictionaries";
import type { AppLocale } from "@/lib/i18n/types";
import { LOCALE_COOKIE } from "@/lib/i18n/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const isStaticExport = process.env.EXPORT_STATIC === "true";

async function localeFromCookie(): Promise<AppLocale> {
  if (isStaticExport) return "zh-TW";
  const jar = await cookies();
  const v = jar.get(LOCALE_COOKIE)?.value;
  return v === "en" ? "en" : "zh-TW";
}

export function generateStaticParams() {
  return GUIDE_ARTICLES_ZH.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeFromCookie();
  const article = getGuideArticleBySlug(slug, locale);
  if (!article) {
    return { title: "Article" };
  }
  const strings = pickStrings(locale);
  const suffix = strings["article.metaSuffix"];
  return {
    title: `${article.title} · ${suffix}`,
    description: article.excerpt,
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await localeFromCookie();
  const article = getGuideArticleBySlug(slug, locale);
  if (!article) notFound();

  const strings = pickStrings(locale);

  return (
    <main className="min-h-dvh bg-app">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <Link
          href="/landing#guide"
          className="inline-flex items-center text-sm font-medium text-ink-muted underline-offset-4 transition hover:text-accent-hover hover:underline"
        >
          {strings["article.back"]}
        </Link>

        <article className="mt-4 rounded-3xl border border-border-warm/60 bg-surface p-6 shadow-card sm:p-10">
          <header className="border-b border-border-warm/50 pb-8">
            <h1 className="font-moodly text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              {article.title}
            </h1>
            {article.excerpt ? (
              <p className="mt-6 text-lg leading-relaxed text-ink-muted sm:text-xl">
                {article.excerpt}
              </p>
            ) : null}
          </header>

          <div className="mt-12 space-y-14 sm:space-y-16">
            {article.sections.map((section, i) => (
              <section key={i} className="space-y-7">
                {section.heading ? (
                  <h2 className="font-moodly text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    {section.heading}
                  </h2>
                ) : null}
                <div className="space-y-8">
                  {section.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="text-base leading-8 tracking-[0.01em] text-ink-muted sm:text-[1.05rem]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
