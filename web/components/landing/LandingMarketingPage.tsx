"use client";

import Link from "next/link";
import Image from "next/image";
import type { TransitionEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ValueCollageInteractive } from "@/components/landing/ValueCollageInteractive";
import { getGuideArticles } from "@/content/guideArticles";
import { useI18n } from "@/contexts/I18nContext";

export function LandingMarketingPage() {
  const { t, locale } = useI18n();

  const heroSlides = useMemo(
    () => [
      { src: "/landing/hero-1.png", alt: t("landing.hero.alt1") },
      { src: "/landing/hero-2.png", alt: t("landing.hero.alt2") },
      { src: "/landing/hero-3.png", alt: t("landing.hero.alt3") },
    ],
    [t],
  );

  const navItems = useMemo(
    () => [
      { href: "#value", label: t("landing.nav.value") },
      { href: "#how", label: t("landing.nav.how") },
      { href: "#voices", label: t("landing.nav.voices") },
    ],
    [t],
  );

  const testimonials = useMemo(
    () => [
      { quote: t("landing.quote1"), name: t("landing.quote1.name") },
      { quote: t("landing.quote2"), name: t("landing.quote2.name") },
      { quote: t("landing.quote3"), name: t("landing.quote3.name") },
    ],
    [t],
  );

  const howSteps = useMemo(
    () => [
      { title: t("landing.how1.title"), body: t("landing.how1.body") },
      { title: t("landing.how2.title"), body: t("landing.how2.body") },
      { title: t("landing.how3.title"), body: t("landing.how3.body") },
    ],
    [t],
  );

  const gridCards = useMemo(
    () => [
      { title: t("landing.g1.title"), desc: t("landing.g1.desc") },
      { title: t("landing.g2.title"), desc: t("landing.g2.desc") },
      { title: t("landing.g3.title"), desc: t("landing.g3.desc") },
      { title: t("landing.g4.title"), desc: t("landing.g4.desc") },
    ],
    [t],
  );

  const footerCols = useMemo(
    () => [
      {
        title: t("landing.footer.p1"),
        links: [
          t("landing.footer.f1"),
          t("landing.footer.f2"),
          t("landing.footer.f3"),
        ],
      },
      {
        title: t("landing.footer.p2"),
        links: [t("landing.footer.r1"), t("landing.footer.r2")],
      },
      {
        title: t("landing.footer.p3"),
        links: [t("landing.footer.l1"), t("landing.footer.l2")],
      },
    ],
    [t],
  );

  const guideArticles = useMemo(
    () => getGuideArticles(locale),
    [locale],
  );
  const [guideFeatured, ...guideSide] = guideArticles;

  const heroN = heroSlides.length;

  const heroExtended = useMemo(() => {
    if (heroN <= 1) return [...heroSlides];
    return [heroSlides[heroN - 1]!, ...heroSlides, heroSlides[0]!];
  }, [heroN, heroSlides]);

  const heroExtLen = heroExtended.length;

  const [heroRailIndex, setHeroRailIndex] = useState(heroN > 1 ? 1 : 0);
  const [heroInstant, setHeroInstant] = useState(false);
  const [tIndex, setTIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  /** 軌道索引永遠落在 [0, heroExtLen-1]，避免連點超出無限輪播複製區而讀到 undefined */
  const heroRailSafe = Math.min(
    Math.max(0, heroRailIndex),
    Math.max(0, heroExtLen - 1),
  );

  const heroRealIndex =
    heroN <= 1
      ? 0
      : heroRailSafe === 0
        ? heroN - 1
        : heroRailSafe === heroExtLen - 1
          ? 0
          : heroRailSafe - 1;

  const heroGo = useCallback(
    (d: number) => {
      if (heroN <= 1) return;
      setHeroInstant(false);
      setHeroRailIndex((i) => {
        const raw = i + d;
        const max = heroExtLen - 1;
        return Math.min(Math.max(0, raw), max);
      });
    },
    [heroN, heroExtLen],
  );

  const onHeroTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;
      if (heroN <= 1) return;
      if (heroRailIndex === heroExtLen - 1) {
        setHeroInstant(true);
        setHeroRailIndex(1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setHeroInstant(false));
        });
      } else if (heroRailIndex === 0) {
        setHeroInstant(true);
        setHeroRailIndex(heroN);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setHeroInstant(false));
        });
      }
    },
    [heroN, heroExtLen, heroRailIndex],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        heroGo(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        heroGo(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [heroGo]);

  /** 每張約停留 5 秒後自動下一張；索引一變就重設計時（手動切換也重新起算） */
  useEffect(() => {
    if (heroN <= 1) return;
    const id = window.setInterval(() => {
      heroGo(1);
    }, 5000);
    return () => window.clearInterval(id);
  }, [heroN, heroGo, heroRailIndex]);

  const slide = heroSlides[heroRealIndex] ?? heroSlides[0];

  return (
    <div className="min-h-screen bg-app text-ink">
      {/* —— 頂部導覽（參考：sticky + logo + 錨點 + 主 CTA） */}
      <header className="sticky top-0 z-50 border-b border-border-warm/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/landing"
            className="font-moodly text-xl font-semibold tracking-wide text-ink"
          >
            {t("common.appName")}
          </Link>

          <nav
            className={`absolute left-0 right-0 top-full z-40 flex-col border-b border-border-warm bg-surface px-4 py-3 shadow-card sm:static sm:z-auto sm:flex sm:flex-row sm:items-center sm:gap-8 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none ${navOpen ? "flex" : "hidden sm:flex"}`}
            aria-label={t("landing.nav.main")}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-2 text-sm font-medium text-ink-muted transition hover:text-accent-hover sm:py-0"
                onClick={() => setNavOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/"
              className="mt-2 rounded-full bg-accent py-2.5 text-center text-sm font-medium text-on-accent sm:mt-0 sm:hidden"
              onClick={() => setNavOpen(false)}
            >
              {t("landing.cta.start")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-card transition hover:bg-accent-hover sm:inline-flex"
            >
              {t("landing.cta.start")}
            </Link>
            <button
              type="button"
              className="rounded-lg border border-border-warm p-2 sm:hidden"
              aria-expanded={navOpen}
              aria-label={navOpen ? t("landing.nav.close") : t("landing.nav.open")}
              onClick={() => setNavOpen((o) => !o)}
            >
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="mt-1 block h-0.5 w-5 bg-ink" />
              <span className="mt-1 block h-0.5 w-5 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* —— Hero：橫向滑動輪播 + 輕量 mask（無玻璃擬態） */}
        <section
          className="relative w-full overflow-x-hidden"
          aria-labelledby="landing-hero-heading"
        >
          <div
            className="relative min-h-[min(88dvh,920px)] w-full overflow-hidden"
            aria-live="polite"
          >
            <p key={heroRealIndex} className="sr-only">
              {slide.alt}
            </p>

            <div
              className={`absolute inset-0 z-0 flex min-h-[min(88dvh,920px)] ease-[cubic-bezier(0.25,0.82,0.2,1)] motion-reduce:transition-none ${heroInstant ? "transition-none" : "transition-transform duration-500"}`}
              style={{
                width: `${heroExtLen * 100}%`,
                transform: `translateX(-${(100 / heroExtLen) * heroRailIndex}%)`,
              }}
              onTransitionEnd={onHeroTransitionEnd}
            >
              {heroExtended.map((s, idx) => (
                <div
                  key={`${s.src}-${idx}`}
                  className="relative shrink-0 overflow-hidden"
                  style={{
                    width: `${100 / heroExtLen}%`,
                    minHeight: "min(88dvh, 920px)",
                  }}
                  aria-hidden
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${s.src})` }}
                  />
                </div>
              ))}
            </div>

            {/* 左側漸層：提亮文字區（無 text-shadow 時仍可讀深色字） */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[min(92vw,34rem)] bg-gradient-to-r from-white/48 via-white/18 to-transparent sm:w-[min(88vw,38rem)]"
              aria-hidden
            />
            {/* 底部略暗，保留輪播列與畫面層次 */}
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-black/[0.2]"
              aria-hidden
            />

            <div className="relative z-10 mx-auto flex min-h-[min(88dvh,920px)] w-full max-w-6xl flex-col justify-center px-4 pb-32 pt-20 sm:px-6 sm:pb-36 sm:pt-24">
              <div className="max-w-xl">
                <p className="text-sm font-medium text-accent-hover">
                  {t("landing.hero.badge")}
                </p>
                <h1
                  id="landing-hero-heading"
                  className="font-moodly mt-3 text-4xl font-semibold leading-tight tracking-[0.02em] text-ink sm:mt-4 sm:text-5xl lg:text-6xl"
                >
                  {t("landing.hero.title")}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-ink sm:mt-5 sm:text-lg">
                  {t("landing.hero.sub")}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-on-accent shadow-lg transition hover:bg-accent-hover"
                  >
                    {t("landing.hero.ctaPrimary")}
                  </Link>
                  <a
                    href="#value"
                    className="inline-flex items-center rounded-full border border-ink/25 bg-surface/90 px-6 py-2.5 text-sm font-medium text-ink shadow-md transition hover:border-ink/40 hover:bg-surface"
                  >
                    {t("landing.hero.ctaSecondary")}
                  </a>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/15 bg-ink/55 px-4 py-3 sm:px-6">
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <p className="text-[0.7rem] text-white/85 sm:text-xs">
                  <kbd className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-white">
                    ←
                  </kbd>{" "}
                  <kbd className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-white">
                    →
                  </kbd>{" "}
                  {t("landing.hero.carousel")}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => heroGo(-1)}
                    disabled={heroN <= 1}
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t("landing.hero.prevAria")}
                  >
                    {t("landing.hero.prev")}
                  </button>
                  <span className="min-w-[3.5rem] text-center text-xs font-medium text-white/90">
                    {heroRealIndex + 1} / {heroN}
                  </span>
                  <button
                    type="button"
                    onClick={() => heroGo(1)}
                    disabled={heroN <= 1}
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t("landing.hero.nextAria")}
                  >
                    {t("landing.hero.next")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* —— 信任／背書列（參考：logo strip） */}
        <section className="bg-surface py-6" aria-label={t("landing.trust")}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 opacity-60 sm:gap-10 sm:px-6">
            {["Logo A", "Logo B", "Logo C", "Logo D"].map((x) => (
              <div
                key={x}
                className="flex h-10 min-w-[5.5rem] items-center justify-center rounded-md bg-app px-3 text-xs font-medium text-ink-soft shadow-sm"
              >
                {x}
              </div>
            ))}
          </div>
        </section>

        {/* —— 雙欄：問題／價值敘事 + 媒體區（參考：左文右圖） */}
        <section
          id="value"
          className="scroll-mt-24 bg-app py-16 sm:py-24"
        >
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <h2 className="font-moodly text-3xl font-semibold text-ink sm:text-4xl">
                {t("landing.value.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {t("landing.value.p1")}
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {t("landing.value.p2")}
              </p>
            </div>
            <div className="min-w-0">
              <ValueCollageInteractive />
            </div>
          </div>
        </section>

        {/* —— 如何使用：虛線里程碑路徑（步驟 1–3） */}
        <section
          id="how"
          className="scroll-mt-24 bg-surface py-16 sm:py-24"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-moodly text-center text-3xl font-semibold text-ink sm:text-4xl">
              {t("landing.how.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-ink-muted">
              {t("landing.how.sub")}
            </p>

            <ol className="relative mt-14 space-y-0 sm:mt-16">
              {howSteps.map((row, i) => {
                const step = i + 1;
                const isLast = i === howSteps.length - 1;
                return (
                  <li
                    key={row.title}
                    className="flex gap-4 sm:gap-6"
                  >
                    <div className="flex w-10 shrink-0 flex-col items-center sm:w-11">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/70 bg-app text-sm font-semibold text-accent shadow-sm ring-4 ring-surface sm:h-11 sm:w-11 sm:text-base"
                        aria-hidden
                      >
                        {step}
                      </span>
                      {!isLast ? (
                        <div
                          className="mt-2 min-h-12 w-0 flex-1 border-l-2 border-dashed border-sand"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <div
                      className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-12 sm:pb-14"}`}
                    >
                      <h3 className="text-lg font-semibold text-ink sm:text-xl">
                        <span className="sr-only">
                          {t("landing.how.stepLabel", { step })}
                        </span>
                        {row.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-ink-muted sm:mt-3">
                        {row.body}
                      </p>
                      <a
                        href="#guide"
                        className="mt-4 inline-flex w-fit text-sm font-medium text-accent-hover underline-offset-4 hover:underline"
                      >
                        {t("landing.how.more")}
                      </a>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* —— 引言輪播（參考：testimonial slider） */}
        <section
          id="voices"
          className="scroll-mt-24 bg-app py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-moodly text-center text-3xl font-semibold text-ink">
              {t("landing.voices.title")}
            </h2>
            <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="rounded-full bg-surface px-4 py-2 text-sm shadow-card transition hover:shadow-lg"
                aria-label={t("landing.voices.prev")}
                onClick={() =>
                  setTIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
                }
              >
                ←
              </button>
              <blockquote className="max-w-xl rounded-2xl bg-surface px-8 py-6 text-center shadow-card">
                <p className="text-lg leading-relaxed text-ink">
                  「{testimonials[tIndex]!.quote}」
                </p>
                <footer className="mt-4 text-sm font-medium text-ink-soft">
                  — {testimonials[tIndex]!.name}
                </footer>
                <p className="mt-2 text-amber-600" aria-hidden>
                  ★★★★★
                </p>
              </blockquote>
              <button
                type="button"
                className="rounded-full bg-surface px-4 py-2 text-sm shadow-card transition hover:shadow-lg"
                aria-label={t("landing.voices.next")}
                onClick={() =>
                  setTIndex((i) => (i + 1) % testimonials.length)
                }
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* —— 四格重點（參考：product grid） */}
        <section
          id="solutions"
          className="scroll-mt-24 bg-surface py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-moodly max-w-2xl text-3xl font-semibold text-ink sm:text-4xl">
              {t("landing.grid.title")}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-muted">
              {t("landing.grid.sub")}
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {gridCards.map((c) => (
                <div
                  key={c.title}
                  className="group rounded-2xl bg-app p-6 shadow-card transition hover:bg-peach/20 hover:shadow-lg"
                >
                  <div className="mb-3 text-2xl text-accent" aria-hidden>
                    ◆
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* —— 大標 + 次要內容列（參考：INSIGHTS + 精選文章） */}
        <section
          id="guide"
          className="scroll-mt-24 bg-app py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
              {t("landing.guide.kicker")}
            </p>
            <h2 className="font-moodly mt-2 text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {t("landing.guide.title")}
            </h2>
            <div className="mx-auto mt-4 max-w-3xl rounded-lg bg-surface px-4 py-2 text-center text-xs text-ink-muted shadow-card">
              💡 {t("landing.guide.tip")}
            </div>

            {guideFeatured ? (
              <div className="mt-12 grid gap-8 lg:grid-cols-3">
                <Link
                  href={`/articles/${guideFeatured.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app lg:col-span-2"
                  aria-label={t("landing.guide.readAria", {
                    title: guideFeatured.title,
                  })}
                >
                  <article>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sage/25 shadow-card transition group-hover:shadow-lg">
                      {guideFeatured.coverImage ? (
                        <Image
                          src={guideFeatured.coverImage}
                          alt={guideFeatured.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 66vw, 100vw"
                        />
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-ink group-hover:text-accent-hover">
                      {guideFeatured.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-muted">
                      {guideFeatured.excerpt}
                    </p>
                    <span className="mt-3 inline-flex text-sm font-medium text-ink transition group-hover:text-accent-hover">
                      {t("landing.guide.read")}
                    </span>
                  </article>
                </Link>
                <div className="flex flex-col gap-6">
                  {guideSide.map((item, idx) => (
                    <Link
                      key={item.slug}
                      href={`/articles/${item.slug}`}
                      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app"
                      aria-label={t("landing.guide.readAria", {
                        title: item.title,
                      })}
                    >
                      <article className="rounded-2xl bg-surface p-4 shadow-card transition group-hover:shadow-lg">
                        <div
                          className={`relative aspect-video overflow-hidden rounded-lg ${
                            idx === 0 ? "bg-peach/30" : "bg-sand/40"
                          }`}
                        >
                          {item.coverImage ? (
                            <Image
                              src={item.coverImage}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(min-width: 1024px) 28vw, 100vw"
                            />
                          ) : null}
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-ink group-hover:text-accent-hover">
                          {item.title}
                        </h3>
                        <span className="mt-2 inline-flex text-xs font-medium text-ink transition group-hover:text-accent-hover">
                          {t("landing.guide.read")}
                        </span>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* —— 雙欄 CTA（參考：Virtual Office / Mission） */}
        <section className="bg-surface py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
            <div className="group rounded-2xl bg-app p-8 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                Before / After
              </p>
              <div className="relative mt-2 min-h-16 overflow-hidden">
                <p className="font-moodly text-[2em] leading-tight font-semibold tracking-[0.01em] text-[#d4a373] transition duration-300 group-hover:-translate-y-8 group-hover:opacity-0">
                  {t("landing.cta2.before")}
                </p>
                <p className="font-moodly absolute inset-0 translate-y-8 text-[2em] leading-tight font-semibold tracking-[0.01em] text-[#d4a373] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {t("landing.cta2.after")}
                </p>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-ink">
                {t("landing.cta2.title")}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">{t("landing.cta2.body")}</p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-1 rounded-full bg-accent px-5 py-2 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
              >
                {t("landing.cta2.btn")}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="group rounded-2xl bg-app p-8 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                Before / After
              </p>
              <div className="relative mt-2 min-h-16 overflow-hidden">
                <p className="font-moodly text-[2em] leading-tight font-semibold tracking-[0.01em] text-[#8fbfa1] transition duration-300 group-hover:-translate-y-8 group-hover:opacity-0">
                  {t("landing.cta3.before")}
                </p>
                <p className="font-moodly absolute inset-0 translate-y-8 text-[2em] leading-tight font-semibold tracking-[0.01em] text-[#8fbfa1] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {t("landing.cta3.after")}
                </p>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-ink">
                {t("landing.cta3.title")}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                {t("landing.cta3.body")}
              </p>
              <a
                href="#value"
                className="mt-6 inline-flex items-center gap-1 rounded-full border border-border-sand px-5 py-2 text-sm font-medium text-ink transition hover:bg-peach/30"
                title={t("landing.cta3.titleAttr")}
              >
                {t("landing.cta3.btn")}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* —— 聯絡 + 頁尾（sage #C9D6C4 底 + sage-ink 字） */}
        <section className="bg-sage py-16 text-sage-ink sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-4xl border border-sage-ink/10 bg-surface/95 shadow-card">
              <div className="p-8 sm:p-10">
                <h2 className="font-moodly text-center text-2xl font-semibold text-sage-ink">
                  {t("landing.contact.title")}
                </h2>
                <p className="mt-2 text-center text-sm text-sage-ink/75">
                  {t("landing.contact.hint")}
                </p>
                <form
                  className="mx-auto mt-6 max-w-lg space-y-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    placeholder={t("landing.contact.namePh")}
                    className="w-full rounded-lg border border-sage-ink/20 bg-surface/90 px-3 py-2 text-sm text-ink placeholder:text-ink-soft shadow-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg border border-sage-ink/20 bg-surface/90 px-3 py-2 text-sm text-ink placeholder:text-ink-soft shadow-sm"
                  />
                  <textarea
                    placeholder={t("landing.contact.msgPh")}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-sage-ink/20 bg-surface/90 px-3 py-2 text-sm text-ink placeholder:text-ink-soft shadow-sm"
                  />
                  <button
                    type="submit"
                    className="mx-auto block rounded-full bg-accent px-6 py-2 text-sm font-medium text-on-accent shadow-card hover:bg-accent-hover"
                  >
                    {t("landing.contact.submit")}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <footer className="mx-auto mt-16 max-w-6xl border-t border-sage-ink/15 px-4 pt-10 sm:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-moodly text-lg font-semibold text-sage-ink">
                  Moodly
                </p>
                <p className="mt-2 text-xs text-sage-ink/70">
                  {t("landing.footer.blurb")}
                </p>
              </div>
              {footerCols.map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sage-ink/50">
                    {col.title}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-sage-ink/85">
                    {col.links.map((l) => (
                      <li key={l}>
                        <span className="cursor-default hover:text-sage-ink">
                          {l}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-10 pb-6 text-center text-xs text-sage-ink/55">
              {t("landing.footer.copy", { year: new Date().getFullYear() })}
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
