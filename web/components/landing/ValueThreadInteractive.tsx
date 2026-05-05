"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

type ScatterLayout = {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  z: number;
};

type GridLayout = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** 與 public/landing/value-tile-{1..6}.png 對應（居家靈感拼貼） */
const IMAGE_TILES: { id: string; src: string; alt: string }[] = [
  {
    id: "tile-1",
    src: "/landing/value-tile-1.png",
    alt: "臥室與畫作牆靈感",
  },
  {
    id: "tile-2",
    src: "/landing/value-tile-2.png",
    alt: "現代客廳與植栽",
  },
  {
    id: "tile-3",
    src: "/landing/value-tile-3.png",
    alt: "中性色調起居空間",
  },
  {
    id: "tile-4",
    src: "/landing/value-tile-4.png",
    alt: "玄關與鏡面",
  },
  {
    id: "tile-5",
    src: "/landing/value-tile-5.png",
    alt: "用餐區與綠意",
  },
  {
    id: "tile-6",
    src: "/landing/value-tile-6.png",
    alt: "極簡沙發與光影",
  },
];

function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/** 依桌面區域寬高產生隨機散落（重疊、歪斜、大小不一） */
function randomScatterLayouts(
  count: number,
  cw: number,
  ch: number,
): ScatterLayout[] {
  const pad = 6;
  const safeW = Math.max(160, cw);
  const safeH = Math.max(160, ch);
  const out: ScatterLayout[] = [];

  for (let i = 0; i < count; i++) {
    const sizeMin = Math.floor(Math.min(safeW, safeH) * 0.22);
    const sizeMax = Math.floor(Math.min(safeW, safeH) * 0.34);
    const size = randInt(sizeMin, Math.max(sizeMin, sizeMax));
    const width = size;
    const height = size;
    const maxL = Math.max(pad, safeW - size - pad);
    const maxT = Math.max(pad, safeH - size - pad);
    const left = randInt(pad, maxL);
    const top = randInt(pad, maxT);
    const rotate = Number((-12 + Math.random() * 24).toFixed(2));
    const z = randInt(8, 46);
    out.push({ left, top, width, height, rotate, z });
  }

  return out;
}

/** 依桌面區域計算 3×2 等分格狀 */
function gridLayouts(cw: number, ch: number): GridLayout[] {
  const pad = 14;
  const gap = 10;
  const cols = 3;
  const rows = 2;
  const innerW = Math.max(80, cw - pad * 2);
  const innerH = Math.max(80, ch - pad * 2);
  const cellW = (innerW - gap * (cols - 1)) / cols;
  const cellH = (innerH - gap * (rows - 1)) / rows;
  const size = Math.min(cellW, cellH);
  const xInset = (cellW - size) / 2;
  const yInset = (cellH - size) / 2;
  const slots: GridLayout[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      slots.push({
        left: pad + col * (cellW + gap) + xInset,
        top: pad + row * (cellH + gap) + yInset,
        width: size,
        height: size,
      });
    }
  }
  return slots;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

const DEFAULT_ARENA = { w: 480, h: 360 };

/**
 * Value 區右欄：散落色塊每次隨機；移入／聚焦後磁吸成格狀；離開後再重新隨機散落。
 */
export function ValueThreadInteractive() {
  const reactId = useId();
  const labelId = `${reactId.replace(/:/g, "")}-label`;
  const rootRef = useRef<HTMLElement>(null);
  const playAreaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const [arena, setArena] = useState(DEFAULT_ARENA);
  /** 長度齊備前不渲染積木，避免 SSR 與 client 對 Math.random  hydration 不一致 */
  const [scatterLayouts, setScatterLayouts] = useState<ScatterLayout[]>([]);

  const aligned = reducedMotion || hovered || focused;

  const durationMs = reducedMotion ? 0 : 180;
  const easing = "cubic-bezier(0.25, 0.82, 0.18, 1)";

  const grids = gridLayouts(arena.w, arena.h);

  /** 初次量測桌面區 → 隨機散落（取代 SSR 預設猜測尺寸） */
  useLayoutEffect(() => {
    const el = playAreaRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const w = Math.max(120, width);
    const h = Math.max(120, height);
    setArena({ w, h });
    setScatterLayouts(randomScatterLayouts(IMAGE_TILES.length, w, h));
  }, []);

  const prevAligned = useRef(false);

  /** 從「對齊」回到「散亂」時重新洗牌 */
  useEffect(() => {
    const wasAligned = prevAligned.current;
    prevAligned.current = aligned;
    if (aligned || !wasAligned) return;

    const el = playAreaRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const w = Math.max(120, width);
    const h = Math.max(120, height);
    setArena({ w, h });
    setScatterLayouts(randomScatterLayouts(IMAGE_TILES.length, w, h));
  }, [aligned]);

  return (
    <figure
      ref={rootRef}
      className="relative w-full max-w-120 justify-self-end overflow-hidden rounded-2xl bg-app/80 shadow-card outline-none ring-accent/0 backdrop-blur-[2px] transition-shadow focus-visible:ring-2 focus-visible:ring-accent/40"
      aria-labelledby={labelId}
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        if (document.activeElement !== rootRef.current) {
          setHovered(false);
        }
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setHovered(false);
      }}
    >
      <span id={labelId} className="sr-only">
        互動示意：靈感像桌上隨機散落的參考圖；游標移入或鍵盤聚焦後，圖片會收斂成整齊格狀。
      </span>

      <div
        className="pointer-events-none absolute inset-3 rounded-xl bg-linear-to-br from-sand/30 via-peach/15 to-sage/20 shadow-inner"
        aria-hidden
      />

      <div
        ref={playAreaRef}
        className="relative mx-auto h-[min(360px,58vw)] w-full max-w-120 min-h-65"
      >
        {scatterLayouts.length === IMAGE_TILES.length &&
          IMAGE_TILES.map((b, i) => {
            const pos = aligned ? grids[i]! : scatterLayouts[i]!;
            const sc = scatterLayouts[i]!;
            return (
              <div
                key={b.id}
                className="absolute overflow-hidden rounded-2xl shadow-card ring-1 ring-white/45"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                  zIndex: aligned ? 1 : sc.z,
                  transform: `rotate(${aligned ? 0 : sc.rotate}deg)`,
                  transition: [
                    `left ${durationMs}ms ${easing}`,
                    `top ${durationMs}ms ${easing}`,
                    `width ${durationMs}ms ${easing}`,
                    `height ${durationMs}ms ${easing}`,
                    `transform ${durationMs}ms ${easing}`,
                  ].join(", "),
                }}
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  className="object-cover select-none"
                  sizes="(max-width: 480px) 30vw, 150px"
                  draggable={false}
                />
              </div>
            );
          })}
      </div>

      <figcaption className="sr-only">
        視覺隱喻：整理前為多張重疊的靈感圖；移入後對齊為規則網格，呼應 Moodly
        將需求結構化。
      </figcaption>
    </figure>
  );
}
