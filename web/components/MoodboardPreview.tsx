"use client";

import { MOODBOARD_MAX_IMAGES } from "@/lib/constants";
import type { Room } from "@/lib/types";

type Props = {
  room: Room;
};

/** 供螢幕預覽與 PDF 匯出共用版面的 id */
export const DESIGN_BRIEF_EXPORT_ID = "design-brief-export";

function hashColor(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) {
    h = (h << 5) - h + label.charCodeAt(i);
    h |= 0;
  }
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 35% 82%)`;
}

export function MoodboardPreview({ room }: Props) {
  const shown = room.images.slice(0, MOODBOARD_MAX_IMAGES);
  const extras = room.images.length - shown.length;

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-ink">
        Moodboard 預覽（匯出 PDF 使用此區）
      </h2>

      <div
        id={DESIGN_BRIEF_EXPORT_ID}
        className="rounded-2xl border border-border-warm bg-surface p-6 text-ink shadow-card"
      >
        <header className="border-b border-border-warm pb-4">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Interior Mood Translator · Design Brief
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
              <p className="text-xs font-medium text-ink-soft">色系</p>
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

          <div>
            <p className="text-xs font-medium text-ink-soft">Color palette</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {room.colorTags.length === 0 ? (
                <span className="text-sm text-ink-soft">尚未標註色系</span>
              ) : (
                room.colorTags.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-warm bg-sage/25 px-3 py-2 text-xs text-sage-ink"
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-border-sand"
                      style={{ background: hashColor(c) }}
                      title={c}
                    />
                    {c}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-medium text-ink-soft">圖像拼貼</p>
          {shown.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">尚無圖片</p>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {shown.map((img) => (
                  <div
                    key={img.id}
                    className="overflow-hidden rounded-lg border border-border-warm bg-peach/20"
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
        </div>

        <footer className="mt-8 border-t border-border-warm pt-4 text-[10px] text-ink-soft">
          本文件由「裝潢需求翻譯器」MVP 產生 · 資料儲存於本機瀏覽器
        </footer>
      </div>
    </section>
  );
}
