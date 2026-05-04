"use client";

import { useEffect, useMemo, useState } from "react";
import { MOODBOARD_MAX_FURNITURE, MOODBOARD_MAX_IMAGES } from "@/lib/constants";
import { extractPaletteFromImageSources } from "@/lib/extractImagePalette";
import type { Room } from "@/lib/types";

/** 避免把整段 Data URL 放進 dependency；用短指紋偵測圖片是否換過 */
function hashSrcQuick(src: string): number {
  let h = 0;
  const n = Math.min(src.length, 6000);
  for (let i = 0; i < n; i++) {
    h = (Math.imul(31, h) + src.charCodeAt(i)) | 0;
  }
  return h;
}

type Props = {
  room: Room;
  /** 匯出截圖用 DOM id；預設與單一空間頁相同 */
  exportElementId?: string;
  /** 是否顯示「Moodboard 預覽」標題；首頁離屏批次匯出可設為 false */
  showHeading?: boolean;
};

/** 供螢幕預覽與 PDF 匯出共用版面的 id */
export const DESIGN_BRIEF_EXPORT_ID = "design-brief-export";

const PALETTE_COUNT = 5;

export function MoodboardPreview({
  room,
  exportElementId,
  showHeading = true,
}: Props) {
  const exportId = exportElementId ?? DESIGN_BRIEF_EXPORT_ID;
  const furnitureList = room.furniture ?? [];
  const shownFurniture = furnitureList.slice(0, MOODBOARD_MAX_FURNITURE);
  const furnitureExtras = furnitureList.length - shownFurniture.length;

  const shown = room.images.slice(0, MOODBOARD_MAX_IMAGES);
  const extras = room.images.length - shown.length;

  const [paletteHex, setPaletteHex] = useState<string[]>([]);
  const [paletteLoading, setPaletteLoading] = useState(false);

  const imagePaletteKey = useMemo(
    () =>
      room.images
        .slice(0, MOODBOARD_MAX_IMAGES)
        .map((img) => `${img.id}:${img.src.length}:${hashSrcQuick(img.src)}`)
        .join("|"),
    [room.images],
  );

  useEffect(() => {
    // 色票僅從靈感圖（room.images）萃取；不包含家具圖（furniture）
    const sources = room.images
      .slice(0, MOODBOARD_MAX_IMAGES)
      .map((img) => img.src);
    let cancelled = false;

    if (sources.length === 0) {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setPaletteHex([]);
          setPaletteLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }

    Promise.resolve().then(() => {
      if (!cancelled) setPaletteLoading(true);
    });

    void extractPaletteFromImageSources(sources, PALETTE_COUNT).then(
      (colors) => {
        if (!cancelled) {
          setPaletteHex(colors);
          setPaletteLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imagePaletteKey 已指紋化 room.images
  }, [imagePaletteKey]);

  const card = (
    <div
      id={exportId}
      className="rounded-2xl bg-surface p-6 text-ink shadow-card"
    >
        <header className="pb-4">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Moodly · Design Brief
          </p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            {room.name}
          </h3>
        </header>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium text-ink-soft">文字需求</p>
              <p className="mt-1 whitespace-pre-wrap text-ink">
                {room.notes.trim() || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-soft">風格／關鍵字</p>
              <p className="mt-1 text-ink">
                {room.styleTags.length ? room.styleTags.join(" · ") : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-soft">色系標籤</p>
              <p className="mt-1 text-ink">
                {room.colorTags.length ? room.colorTags.join(" · ") : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-soft">避免項目</p>
              <p className="mt-1 whitespace-pre-wrap text-ink">
                {room.avoidNotes.trim() || "—"}
              </p>
            </div>
          </div>

          <div className="flex min-h-[120px] flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
              INSPIRATION IMAGES
            </p>
            {shown.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">尚無圖片</p>
            ) : (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {shown.map((img) => (
                    <div
                      key={img.id}
                      className="overflow-hidden rounded-lg bg-peach/20 shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt=""
                        className="aspect-square w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ))}
                </div>
                {extras > 0 && (
                  <p className="mt-2 text-xs text-ink-soft">
                    另有 {extras} 張未放入拼貼（單頁最多 {MOODBOARD_MAX_IMAGES}{" "}
                    張）
                  </p>
                )}
              </>
            )}

            {shownFurniture.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-2">
                  {shownFurniture.map((f) => (
                    <div
                      key={f.id}
                      className="overflow-hidden rounded-lg bg-peach/20 shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.imageSrc}
                        alt=""
                        className="aspect-square w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ))}
                </div>
                {furnitureExtras > 0 && (
                  <p className="mt-2 text-xs text-ink-soft">
                    另有 {furnitureExtras} 件家具圖未放入拼貼（單頁最多{" "}
                    {MOODBOARD_MAX_FURNITURE} 張）
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
            COLOR PALETTE
          </p>
          <p className="mt-1 text-[10px] text-ink-soft">
            依靈感圖片自動萃取 5 色
          </p>
          {shown.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">尚無圖片，無法產生色票</p>
          ) : paletteLoading ? (
            <p className="mt-4 text-sm text-ink-soft">分析圖片色調中…</p>
          ) : paletteHex.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">
              無法從目前圖片萃取色票（可能為載入限制）
            </p>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {paletteHex.map((hex) => (
                <span
                  key={hex}
                  className="h-12 w-12 shrink-0 rounded-full shadow-md ring-2 ring-white ring-offset-1 ring-offset-surface"
                  style={{ backgroundColor: hex }}
                  title={hex.toUpperCase()}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="mt-8 pt-4 text-[10px] text-ink-soft">
          <p>Design summary — for discussion purposes only.</p>
          <p className="mt-1">設計摘要 · 供討論使用。</p>
        </footer>
    </div>
  );

  if (!showHeading) {
    return <div className="w-full max-w-3xl shrink-0">{card}</div>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-ink">
        Moodboard 預覽（匯出 PDF 使用此區）
      </h2>
      {card}
    </section>
  );
}
