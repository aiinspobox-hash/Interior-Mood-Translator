"use client";

import Image from "next/image";
import { useCallback, useId, useMemo, useState } from "react";

import { useI18n } from "@/contexts/I18nContext";

type StyleSlide = {
  id: string;
  src: string;
  alt: string;
  title: string;
  keywords: [string, string, string];
};

/**
 * Value 區右欄：左側四張小縮圖（窄螢幕時縮圖在上），右側大圖、標題與 # 關鍵字。
 */
export function ValueCollageInteractive() {
  const { t } = useI18n();
  const slides = useMemo<StyleSlide[]>(
    () => [
      {
        id: "gallery-bedroom",
        src: "/landing/value-tile-1.jpg",
        alt: t("value.s1.alt"),
        title: t("value.s1.title"),
        keywords: [t("value.s1.k1"), t("value.s1.k2"), t("value.s1.k3")],
      },
      {
        id: "modern-green-living",
        src: "/landing/value-tile-2.jpg",
        alt: t("value.s2.alt"),
        title: t("value.s2.title"),
        keywords: [t("value.s2.k1"), t("value.s2.k2"), t("value.s2.k3")],
      },
      {
        id: "neutral-lounge",
        src: "/landing/value-tile-3.jpg",
        alt: t("value.s3.alt"),
        title: t("value.s3.title"),
        keywords: [t("value.s3.k1"), t("value.s3.k2"), t("value.s3.k3")],
      },
      {
        id: "entry-mirror",
        src: "/landing/value-tile-4.jpg",
        alt: t("value.s4.alt"),
        title: t("value.s4.title"),
        keywords: [t("value.s4.k1"), t("value.s4.k2"), t("value.s4.k3")],
      },
    ],
    [t],
  );

  const reactId = useId();
  const baseId = reactId.replace(/:/g, "");
  const labelId = `${baseId}-gallery-label`;
  const panelId = `${baseId}-detail-panel`;
  const [active, setActive] = useState(0);
  const n = slides.length;
  const current = slides[active]!;

  const focusTab = useCallback(
    (index: number) => {
      const el = document.getElementById(`${baseId}-tab-${index % n}`);
      el?.focus();
    },
    [baseId, n],
  );

  return (
    <figure className="relative w-full" aria-labelledby={labelId}>
      <span id={labelId} className="sr-only">
        {t("value.srOnly")}
      </span>

      <div className="overflow-hidden rounded-[22px] bg-app/80 p-3 shadow-card backdrop-blur-[2px] sm:p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
          <div
            role="tablist"
            aria-label={t("value.tablist")}
            className="flex shrink-0 flex-row justify-center gap-2 sm:flex-col sm:justify-start sm:gap-2.5"
          >
            {slides.map((item, i) => {
              const selected = active === i;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg outline-none transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app sm:h-12 sm:w-12 ${
                    selected
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-app"
                      : "ring-1 ring-border-warm/45 hover:ring-peach/70"
                  } `}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      const next = (i + 1) % n;
                      setActive(next);
                      focusTab(next);
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      const prev = (i - 1 + n) % n;
                      setActive(prev);
                      focusTab(prev);
                    }
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="48px"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            className="flex min-w-0 flex-1 flex-col gap-4"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-surface">
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 60vw"
                priority={active === 0}
                draggable={false}
              />
            </div>
            <div className="flex flex-col gap-3 px-0.5 pb-0.5">
              <h3 className="font-moodly text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                {current.title}
              </h3>
              <ul
                className="flex flex-wrap gap-x-3 gap-y-2"
                aria-label={t("value.kwAria", { title: current.title })}
              >
                {current.keywords.map((kw) => (
                  <li
                    key={`${current.id}-${kw}`}
                    className="text-sm text-ink-muted sm:text-base"
                  >
                    #{kw}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="sr-only">
        {t("value.live", { title: current.title })}{" "}
        {current.keywords.map((k) => `#${k}`).join("、")}。
      </figcaption>
    </figure>
  );
}
