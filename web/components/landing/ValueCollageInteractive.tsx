"use client";

import Image from "next/image";
import { useCallback, useId, useState } from "react";

type StyleSlide = {
  id: string;
  src: string;
  alt: string;
  title: string;
  /** 風格關鍵字（每組 3 個短詞） */
  keywords: [string, string, string];
};

/** 四張靈感圖 + 風格關鍵字（public/landing/value-tile-{1..4}.jpg） */
const STYLE_SLIDES: StyleSlide[] = [
  {
    id: "gallery-bedroom",
    src: "/landing/value-tile-1.jpg",
    alt: "臥室主牆展示多幅畫作與柔和床品",
    title: "藝廊式臥房",
    keywords: ["床頭策展牆", "畫框層次", "暖白"],
  },
  {
    id: "modern-green-living",
    src: "/landing/value-tile-2.jpg",
    alt: "現代客廳、綠植與編織燈飾",
    title: "植栽 × 現代客廳",
    keywords: ["低背沙發", "藤編燈", "中性底"],
  },
  {
    id: "neutral-lounge",
    src: "/landing/value-tile-3.jpg",
    alt: "中性色調起居空間與柔軟織品",
    title: "低彩度．慢生活",
    keywords: ["沙色", "灰褐", "織品"],
  },
  {
    id: "entry-mirror",
    src: "/landing/value-tile-4.jpg",
    alt: "玄關鏡面與線條燈具",
    title: "鏡面．延伸玄關",
    keywords: ["鏡牆", "線條燈", "小坪數"],
  },
];

/**
 * Value 區右欄：左側四張小縮圖（窄螢幕時縮圖在上），右側大圖、標題與 # 關鍵字。
 */
export function ValueCollageInteractive() {
  const reactId = useId();
  const baseId = reactId.replace(/:/g, "");
  const labelId = `${baseId}-gallery-label`;
  const panelId = `${baseId}-detail-panel`;
  const [active, setActive] = useState(0);
  const current = STYLE_SLIDES[active]!;

  const focusTab = useCallback(
    (index: number) => {
      const el = document.getElementById(
        `${baseId}-tab-${index % STYLE_SLIDES.length}`,
      );
      el?.focus();
    },
    [baseId],
  );

  return (
    <figure className="relative w-full" aria-labelledby={labelId}>
      <span id={labelId} className="sr-only">
        透過左側（窄螢幕為上方）四張小圖選取風格，右側顯示大圖與風格關鍵字；可使用鍵盤
        Tab 切換縮圖按鈕。
      </span>

      <div className="overflow-hidden rounded-[22px] bg-app/80 p-3 shadow-card backdrop-blur-[2px] sm:p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
          <div
            role="tablist"
            aria-label="風格縮圖"
            className="flex shrink-0 flex-row justify-center gap-2 sm:flex-col sm:justify-start sm:gap-2.5"
          >
            {STYLE_SLIDES.map((item, i) => {
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
                    if (
                      e.key === "ArrowRight" ||
                      e.key === "ArrowDown"
                    ) {
                      e.preventDefault();
                      const next = (i + 1) % STYLE_SLIDES.length;
                      setActive(next);
                      focusTab(next);
                    } else if (
                      e.key === "ArrowLeft" ||
                      e.key === "ArrowUp"
                    ) {
                      e.preventDefault();
                      const prev =
                        (i - 1 + STYLE_SLIDES.length) % STYLE_SLIDES.length;
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
                aria-label={`${current.title} 風格關鍵字`}
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
        選取的風格為「{current.title}」，關鍵字：
        {current.keywords.map((k) => `#${k}`).join("、")}。
      </figcaption>
    </figure>
  );
}
