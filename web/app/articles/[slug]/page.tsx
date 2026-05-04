import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getGuideArticleBySlug,
  GUIDE_ARTICLES,
} from "@/content/guideArticles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return GUIDE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideArticleBySlug(slug);
  if (!article) {
    return { title: "文章" };
  }
  return {
    title: `${article.title} · Moodly 裝潢溝通指南`,
    description: article.excerpt,
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getGuideArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="min-h-dvh bg-app">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <Link
          href="/landing#guide"
          className="text-sm font-medium text-ink-muted underline-offset-4 hover:text-accent-hover hover:underline"
        >
          ← 延伸閱讀
        </Link>
        <h1 className="font-moodly mt-6 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {article.title}
        </h1>
        {article.excerpt ? (
          <p className="mt-4 text-lg text-ink-muted">{article.excerpt}</p>
        ) : null}
        <div className="mt-10 space-y-10">
          {article.sections.map((section, i) => (
            <section key={i} className="space-y-4">
              {section.heading ? (
                <h2 className="text-lg font-semibold text-ink">
                  {section.heading}
                </h2>
              ) : null}
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="text-base leading-relaxed text-ink-muted"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
