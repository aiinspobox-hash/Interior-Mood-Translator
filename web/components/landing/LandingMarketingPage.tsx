"use client";

import Link from "next/link";
import type { TransitionEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ValueCollageInteractive } from "@/components/landing/ValueCollageInteractive";
import { GUIDE_ARTICLES } from "@/content/guideArticles";

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
    quote:
      "原本跟設計師雞同鴨講，用了 Moodly 的 PDF 摘要後，對方馬上抓到我要的色調和風格，省下超多溝通時間！",
    name: "Emily，首購族",
  },
  {
    quote:
      "我喜歡它的『避免項目』功能，我討厭深色木紋，標註後終於不用再看那些我不喜歡的設計了。",
    name: "Kevin，租屋改造者",
  },
  {
    quote:
      "介面很乾淨，匯出的 PDF 很專業，直接存在手機裡去挑家具也很好用。",
    name: "Sarah，室內設計師客戶",
  },
] as const;

const HOW_STEPS = [
  {
    title: "建立空間需求",
    body: "選擇居家類型，填寫生活習慣與避諱材質，定義出屬於你的空間個性。",
  },
  {
    title: "匯入靈感碎片",
    body: "上傳心動圖片或貼上網址，加入家具意向，讓抽象的想法具象化為視覺圖板。",
  },
  {
    title: "匯出設計摘要",
    body: "預覽自動排版後的 Moodboard，一鍵轉存 PDF，隨時隨地與設計師精準對頻。",
  },
] as const;

const GRID_CARDS = [
  {
    title: "靈感雜亂無章",
    desc: "提供系統化標籤管理，讓你的素材從雜亂變井然。",
  },
  {
    title: "設計需求難言傳",
    desc: "透過結構化文字欄位，引導你精準描述對生活的期待。",
  },
  {
    title: "溝通落差大",
    desc: "PDF 設計摘要讓設計師精準掌握視覺偏好，降低來回修圖的風險。",
  },
  {
    title: "圖片整合困難",
    desc: "透過 API 代抓與 Base64 轉換，無論來源為何，都能整合為統一格式的圖板。",
  },
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

  const [guideFeatured, ...guideSide] = GUIDE_ARTICLES;

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
                  讓你的裝潢靈感不再零散。從破碎的收藏，到精準的設計摘要，Moodly
                  幫你精準傳達對家的所有想像。
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
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <h2 className="font-moodly text-3xl font-semibold text-ink sm:text-4xl">
                把雜亂的靈感，變成設計師一眼就懂的溝通語言。
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                痛點與對應：你是否收藏了無數張 Pinterest
                美圖，卻無法描述出真正的喜好？面對設計師時，總怕表達不完整導致成品有落差？Moodly
                協助你將散亂的截圖與關鍵字系統化，自動生成專業的「設計摘要」，讓溝通效率翻倍。
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                適用情境：無論是準備翻新舊屋、買了新房想進行裝潢，還是小資租屋族的輕改造，在尋求專業諮詢前，先用
                Moodly 梳理你的居家藍圖，讓每一分預算都花在心坎上。
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
              如何使用 Moodly
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-ink-muted">
              簡單三步驟，完成你的專屬室內設計溝通檔案。
            </p>

            <ol className="relative mt-14 space-y-0 sm:mt-16">
              {HOW_STEPS.map((row, i) => {
                const step = i + 1;
                const isLast = i === HOW_STEPS.length - 1;
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
                        <span className="sr-only">步驟 {step}：</span>
                        {row.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-ink-muted sm:mt-3">
                        {row.body}
                      </p>
                      <a
                        href="#guide"
                        className="mt-4 inline-flex w-fit text-sm font-medium text-accent-hover underline-offset-4 hover:underline"
                      >
                        了解更多 →
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
              超過 500 位使用者的裝潢起點
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
              從收藏到共識，最常見的四個卡點
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-muted">
              以下對應 Moodly 的核心流程與功能設計，讓你快速掃讀我們如何收斂糾結。
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
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
              Moodly 裝潢溝通指南
            </p>
            <h2 className="font-moodly mt-2 text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              延伸閱讀
            </h2>
            <div className="mx-auto mt-4 max-w-3xl rounded-lg bg-surface px-4 py-2 text-center text-xs text-ink-muted shadow-card">
              💡
              小貼士：上傳圖片建議為 JPG 或 PNG
              格式，並建議在完成初步規劃後，儘早匯出 PDF 備份您的資料喔！
            </div>

            {guideFeatured ? (
              <div className="mt-12 grid gap-8 lg:grid-cols-3">
                <Link
                  href={`/articles/${guideFeatured.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app lg:col-span-2"
                  aria-label={`閱讀：${guideFeatured.title}`}
                >
                  <article>
                    <div
                      className="aspect-[16/10] rounded-2xl bg-sage/25 shadow-card transition group-hover:shadow-lg"
                      aria-hidden
                    />
                    <h3 className="mt-4 text-xl font-semibold text-ink group-hover:text-accent-hover">
                      {guideFeatured.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-muted">
                      {guideFeatured.excerpt}
                    </p>
                    <span className="mt-3 inline-flex text-sm font-medium text-accent-hover opacity-0 transition group-hover:opacity-100">
                      閱讀全文 →
                    </span>
                  </article>
                </Link>
                <div className="flex flex-col gap-6">
                  {guideSide.map((item, idx) => (
                    <Link
                      key={item.slug}
                      href={`/articles/${item.slug}`}
                      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app"
                      aria-label={`閱讀：${item.title}`}
                    >
                      <article className="rounded-2xl bg-surface p-4 shadow-card transition group-hover:shadow-lg">
                        <div
                          className={`aspect-video rounded-lg ${idx === 0 ? "bg-peach/30" : "bg-sand/40"}`}
                          aria-hidden
                        />
                        <h3 className="mt-3 text-sm font-semibold text-ink group-hover:text-accent-hover">
                          {item.title}
                        </h3>
                        <span className="mt-2 inline-flex text-xs font-medium text-accent-hover opacity-0 transition group-hover:opacity-100">
                          閱讀全文 →
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
            <div className="rounded-2xl bg-app p-8 shadow-card">
              <div className="h-24 rounded-lg bg-peach/25" aria-hidden />
              <h3 className="mt-6 text-xl font-semibold text-ink">
                準備好開始整理了嗎？
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                無需註冊，直接在瀏覽器建立你的第一個空間，開始規劃你的夢想居家。
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover"
              >
                立即體驗
              </Link>
            </div>
            <div className="rounded-2xl bg-app p-8 shadow-card">
              <div className="h-24 rounded-lg bg-sage/25" aria-hidden />
              <h3 className="mt-6 text-xl font-semibold text-ink">
                關於 Moodly
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                我們相信，每個人都值得擁有理想的生活空間，而這一切就從釐清需求開始。
              </p>
              <a
                href="#value"
                className="mt-6 inline-flex rounded-full border border-border-sand px-5 py-2 text-sm font-medium text-ink hover:bg-peach/30"
                title="了解更多"
              >
                品牌理念
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
