"use client";

import Link from "next/link";
import type { TransitionEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

const HERO_SLIDES = [
  {
    src: "/landing/hero-1.png",
    alt: "現代簡約客廳空間，木質與植栽、柔和自然光",
  },
  {
    src: "/landing/hero-2.png",
    alt: "淺色沙發與木質茶几的客廳，抽象畫與吊燈",
  },
  {
    src: "/landing/hero-3.png",
    alt: "綠色模組沙發與極簡白牆的明亮起居空間",
  },
] as const;

const NAV = [
  { href: "#value", label: "能為你解決什麼" },
  { href: "#how", label: "如何使用" },
  { href: "#voices", label: "使用者回聲" },
] as const;

const TESTIMONIALS = [
  {
    quote: "（佔位）之後可放真實回饋：整理靈感變快很多。",
    name: "使用者 A",
  },
  {
    quote: "（佔位）預留第二則引言區塊。",
    name: "使用者 B",
  },
  {
    quote: "（佔位）第三則，可搭配輪播或靜態列表。",
    name: "使用者 C",
  },
] as const;

const ZIGZAG = [
  {
    title: "步驟一（佔位）",
    body: "此區將放「如何使用 Moodly」的第一步說明。",
    align: "left" as const,
  },
  {
    title: "步驟二（佔位）",
    body: "此區將放第二步：建立空間、上傳靈感圖等。",
    align: "right" as const,
  },
  {
    title: "步驟三（佔位）",
    body: "此區將放第三步：匯出 moodboard／PDF 等。",
    align: "left" as const,
  },
];

const GRID_CARDS = [
  { title: "痛點一（佔位）", desc: "之後寫這個產品能解決的具體情境。" },
  { title: "痛點二（佔位）", desc: "簡短一句話說明價值主張。" },
  { title: "痛點三（佔位）", desc: "可連結到下方詳細說明區塊。" },
  { title: "痛點四（佔位）", desc: "四格網格方便掃讀。" },
];

export function LandingMarketingPage() {
  const heroN = HERO_SLIDES.length;

  const heroExtended = useMemo(() => {
    if (heroN <= 1) return [...HERO_SLIDES];
    return [HERO_SLIDES[heroN - 1], ...HERO_SLIDES, HERO_SLIDES[0]];
  }, [heroN]);

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

  const slide = HERO_SLIDES[heroRealIndex] ?? HERO_SLIDES[0];

  return (
    <div className="min-h-screen bg-app text-ink">
      {/* —— 頂部導覽（參考：sticky + logo + 錨點 + 主 CTA） */}
      <header className="sticky top-0 z-50 border-b border-border-warm/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/landing"
            className="font-moodly text-xl font-semibold tracking-wide text-ink"
          >
            Moodly
          </Link>

          <nav
            className={`absolute left-0 right-0 top-full z-40 flex-col border-b border-border-warm bg-surface px-4 py-3 shadow-card sm:static sm:z-auto sm:flex sm:flex-row sm:items-center sm:gap-8 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none ${navOpen ? "flex" : "hidden sm:flex"}`}
            aria-label="主要導覽"
          >
            {NAV.map((item) => (
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
              開始使用
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-card transition hover:bg-accent-hover sm:inline-flex"
            >
              開始使用
            </Link>
            <button
              type="button"
              className="rounded-lg border border-border-warm p-2 sm:hidden"
              aria-expanded={navOpen}
              aria-label={navOpen ? "關閉選單" : "開啟選單"}
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
                  居家靈感 · 設計摘要
                </p>
                <h1
                  id="landing-hero-heading"
                  className="font-moodly mt-3 text-4xl font-semibold leading-tight tracking-[0.02em] text-ink sm:mt-4 sm:text-5xl lg:text-6xl"
                >
                  把裝潢靈感，整理成看得懂的 moodboard。
                </h1>
                <p className="mt-4 text-base leading-relaxed text-ink sm:mt-5 sm:text-lg">
                  （佔位）這裡放一句副標，說明 Moodly
                  適合誰、在什麼情境使用。下方區塊將展開「能解決什麼」與「如何使用」。
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-on-accent shadow-lg transition hover:bg-accent-hover"
                  >
                    開始使用
                  </Link>
                  <a
                    href="#value"
                    className="inline-flex items-center rounded-full border border-ink/25 bg-surface/90 px-6 py-2.5 text-sm font-medium text-ink shadow-md transition hover:border-ink/40 hover:bg-surface"
                  >
                    了解能幫你什麼
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
                  切換主視覺
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => heroGo(-1)}
                    disabled={heroN <= 1}
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="上一張"
                  >
                    ← 上一張
                  </button>
                  <span className="min-w-[3.5rem] text-center text-xs font-medium text-white/90">
                    {heroRealIndex + 1} / {heroN}
                  </span>
                  <button
                    type="button"
                    onClick={() => heroGo(1)}
                    disabled={heroN <= 1}
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="下一張"
                  >
                    下一張 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* —— 信任／背書列（參考：logo strip） */}
        <section className="bg-surface py-6" aria-label="合作與背書（佔位）">
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
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <div className="mb-6 inline-flex rounded-2xl bg-peach/20 p-4 text-sage-ink shadow-card">
                <span className="text-3xl" aria-hidden>
                  ◎
                </span>
              </div>
              <h2 className="font-moodly text-3xl font-semibold text-ink sm:text-4xl">
                能為你解決什麼？（區塊佔位）
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                此段預留給你寫「使用者的痛點」與 Moodly
                如何對應。可放兩到三段說明，語氣建議具體、好掃讀。
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                第二段佔位：之後可補充使用情境（例如：找設計師前、租屋改造、整屋裝潢等）。
              </p>
              <p className="mt-8 text-lg italic text-ink-soft">
                — 簽名區佔位
              </p>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-sand/30 shadow-card">
              <div className="absolute inset-0 flex items-center justify-center bg-ink/5">
                <span className="rounded-full border-2 border-ink/20 px-5 py-2 text-sm font-medium text-ink-muted">
                  ▶ 影片／圖說佔位
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* —— 如何使用：交錯區塊 + 路徑感（參考：services zigzag） */}
        <section
          id="how"
          className="scroll-mt-24 bg-surface py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-moodly text-center text-3xl font-semibold text-ink sm:text-4xl">
              如何使用 Moodly
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-ink-muted">
              （佔位）中間可放虛線「路徑」裝飾；以下為步驟式區塊，日後替換成你的教學文案。
            </p>

            <div className="relative mt-16 space-y-20 lg:space-y-24">
              <div
                className="pointer-events-none absolute left-4 top-0 hidden h-[calc(100%-2rem)] w-0 border-l-2 border-dashed border-sand lg:left-1/2 lg:block lg:-translate-x-px"
                aria-hidden
              />

              {ZIGZAG.map((row, i) => {
                const isLeft = row.align === "left";
                return (
                  <div
                    key={row.title}
                    className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center"
                  >
                    <div
                      className={`flex min-h-[180px] items-center justify-center rounded-2xl bg-peach/15 p-8 shadow-card ${isLeft ? "" : "lg:order-2"}`}
                    >
                      <span className="text-5xl text-ink/15" aria-hidden>
                        {i + 1}
                      </span>
                    </div>
                    <div
                      className={`flex flex-col justify-center ${isLeft ? "" : "lg:order-1"}`}
                    >
                      <h3 className="text-xl font-semibold text-ink">
                        {row.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-ink-muted">
                        {row.body}
                      </p>
                      <a
                        href="#guide"
                        className="mt-4 inline-flex w-fit text-sm font-medium text-accent-hover underline-offset-4 hover:underline"
                      >
                        了解更多 →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* —— 引言輪播（參考：testimonial slider） */}
        <section
          id="voices"
          className="scroll-mt-24 bg-app py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-moodly text-center text-3xl font-semibold text-ink">
              使用者回聲（佔位）
            </h2>
            <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="rounded-full bg-surface px-4 py-2 text-sm shadow-card transition hover:shadow-lg"
                aria-label="上一則"
                onClick={() =>
                  setTIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
                }
              >
                ←
              </button>
              <blockquote className="max-w-xl rounded-2xl bg-surface px-8 py-6 text-center shadow-card">
                <p className="text-lg leading-relaxed text-ink">
                  「{TESTIMONIALS[tIndex].quote}」
                </p>
                <footer className="mt-4 text-sm font-medium text-ink-soft">
                  — {TESTIMONIALS[tIndex].name}
                </footer>
                <p className="mt-2 text-amber-600" aria-hidden>
                  ★★★★★
                </p>
              </blockquote>
              <button
                type="button"
                className="rounded-full bg-surface px-4 py-2 text-sm shadow-card transition hover:shadow-lg"
                aria-label="下一則"
                onClick={() =>
                  setTIndex((i) => (i + 1) % TESTIMONIALS.length)
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
              停下來問路也沒關係（標題佔位）
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-muted">
              下方四格可對應「能解決的問題」精簡版，方便快速掃讀。
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {GRID_CARDS.map((c) => (
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
                  <span className="mt-4 inline-flex text-sm font-medium text-accent-hover group-hover:underline">
                    查看 →
                  </span>
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
            <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-ink-soft">
              延伸閱讀／教學（佔位）
            </p>
            <h2 className="font-moodly mt-2 text-center text-5xl font-semibold tracking-tight text-ink sm:text-6xl md:text-7xl">
              GUIDE
            </h2>
            <div className="mx-auto mt-4 max-w-3xl rounded-lg bg-surface px-4 py-2 text-center text-xs text-ink-muted shadow-card">
              （佔位）跑馬燈或一句話提示：例如「本週更新：匯出 PDF
              教學」— 可改為真實資料或刪除。
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              <article className="lg:col-span-2">
                <div className="aspect-[16/10] rounded-2xl bg-sage/25 shadow-card" />
                <h3 className="mt-4 text-xl font-semibold text-ink">
                  精選長文標題（佔位）
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  摘要兩行佔位，之後可連到部落格或說明頁。
                </p>
              </article>
              <div className="flex flex-col gap-6">
                <article className="rounded-2xl bg-surface p-4 shadow-card">
                  <div className="aspect-video rounded-lg bg-peach/30" />
                  <h3 className="mt-3 text-sm font-semibold text-ink">
                    短文一（佔位）
                  </h3>
                </article>
                <article className="rounded-2xl bg-surface p-4 shadow-card">
                  <div className="aspect-video rounded-lg bg-sand/40" />
                  <h3 className="mt-3 text-sm font-semibold text-ink">
                    短文二（佔位）
                  </h3>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* —— 雙欄 CTA（參考：Virtual Office / Mission） */}
        <section className="bg-surface py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
            <div className="rounded-2xl bg-app p-8 shadow-card">
              <div className="h-24 rounded-lg bg-peach/25" aria-hidden />
              <h3 className="mt-6 text-xl font-semibold text-ink">
                區塊 A（佔位）
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                例如：線上體驗、快速試用等 CTA 說明。
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover"
              >
                前往
              </Link>
            </div>
            <div className="rounded-2xl bg-app p-8 shadow-card">
              <div className="h-24 rounded-lg bg-sage/25" aria-hidden />
              <h3 className="mt-6 text-xl font-semibold text-ink">
                區塊 B（佔位）
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                例如：品牌理念、為什麼做 Moodly。
              </p>
              <a
                href="#value"
                className="mt-6 inline-flex rounded-full border border-border-sand px-5 py-2 text-sm font-medium text-ink hover:bg-peach/30"
              >
                了解更多
              </a>
            </div>
          </div>
        </section>

        {/* —— 聯絡 + 頁尾（sage #C9D6C4 底 + sage-ink 字） */}
        <section className="bg-sage py-16 text-sage-ink sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-moodly text-2xl font-semibold text-sage-ink">
                與我們聯絡（表單佔位）
              </h2>
              <p className="mt-2 text-sm text-sage-ink/75">
                之後可接後端或第三方表單；目前僅版型。
              </p>
              <form
                className="mt-6 space-y-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  placeholder="姓名"
                  className="w-full rounded-lg border border-sage-ink/20 bg-surface/90 px-3 py-2 text-sm text-ink placeholder:text-ink-soft shadow-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg border border-sage-ink/20 bg-surface/90 px-3 py-2 text-sm text-ink placeholder:text-ink-soft shadow-sm"
                />
                <textarea
                  placeholder="訊息"
                  rows={3}
                  className="w-full rounded-lg border border-sage-ink/20 bg-surface/90 px-3 py-2 text-sm text-ink placeholder:text-ink-soft shadow-sm"
                />
                <button
                  type="submit"
                  className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-on-accent shadow-card hover:bg-accent-hover"
                >
                  送出（佔位）
                </button>
              </form>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-surface/50 p-8 shadow-card">
              <span className="text-center text-sm text-sage-ink/60">
                插圖／品牌視覺佔位
              </span>
            </div>
          </div>

          <footer className="mx-auto mt-16 max-w-6xl border-t border-sage-ink/15 px-4 pt-10 sm:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-moodly text-lg font-semibold text-sage-ink">
                  Moodly
                </p>
                <p className="mt-2 text-xs text-sage-ink/70">
                  本機優先的靈感整理工具（佔位說明）。
                </p>
              </div>
              {[
                { title: "產品", links: ["功能一", "功能二", "定價（佔位）"] },
                { title: "資源", links: ["說明文件", "部落格（佔位）"] },
                { title: "法律", links: ["隱私權", "條款（佔位）"] },
              ].map((col) => (
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
              © {new Date().getFullYear()} Moodly · 頁尾佔位
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
