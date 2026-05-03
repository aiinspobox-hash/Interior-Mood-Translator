"use client";

import { useRef, useState } from "react";
import { MAX_IMAGE_BYTES } from "@/lib/constants";
import type { InspireImage } from "@/lib/types";

type Props = {
  images: InspireImage[];
  onAdd: (image: Omit<InspireImage, "id">) => void;
  onRemove: (imageId: string) => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function InspirationImages({ images, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [labelDraft, setLabelDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onPickFiles(files: FileList | null) {
    setError(null);
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("請選擇圖片檔案");
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`單張請小於 ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB`);
        continue;
      }
      try {
        const src = await readFileAsDataUrl(file);
        onAdd({ src, sourceLabel: labelDraft.trim() || file.name });
      } catch {
        setError("讀取圖片失敗");
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function addFromUrl() {
    setError(null);
    const raw = urlDraft.trim();
    if (!raw) return;
    let u: URL;
    try {
      u = new URL(raw);
    } catch {
      setError("請輸入有效的 http(s) 圖片網址");
      return;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      setError("僅支援 http / https");
      return;
    }
    onAdd({
      src: u.toString(),
      sourceLabel: labelDraft.trim() || u.hostname,
    });
    setUrlDraft("");
  }

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-ink">靈感圖片</h2>
      <p className="text-sm text-ink-muted">
        上傳檔案或貼上圖片 URL；可選填來源標記（品牌、平台）。
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border-warm bg-peach/40 p-4">
          <p className="mb-2 text-xs font-medium text-ink-muted">本機上傳</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-on-accent file:hover:bg-accent-hover"
            onChange={(e) => void onPickFiles(e.target.files)}
          />
        </div>
        <div className="rounded-xl border border-border-warm bg-peach/40 p-4">
          <p className="mb-2 text-xs font-medium text-ink-muted">圖片網址</p>
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://..."
            className="mb-2 w-full rounded-lg border border-border-warm bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
          />
          <button
            type="button"
            onClick={addFromUrl}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-on-accent hover:bg-accent-hover"
          >
            加入網址圖片
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border-warm bg-surface p-4">
        <label className="text-xs font-medium text-ink-muted">
          來源標記（選填，套用於接下來新增的圖片）
        </label>
        <input
          value={labelDraft}
          onChange={(e) => setLabelDraft(e.target.value)}
          placeholder="例：Pinterest、品牌官網"
          className="mt-1 w-full rounded-lg border border-border-warm px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
        />
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-ink-soft">尚無圖片，請先上傳或加入網址。</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-border-warm bg-peach/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt=""
                className="aspect-square w-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="flex items-center justify-between gap-1 border-t border-border-warm bg-surface px-2 py-1 text-[10px] text-ink-muted">
                <span className="truncate">{img.sourceLabel ?? "—"}</span>
                <button
                  type="button"
                  className="shrink-0 text-danger hover:underline"
                  onClick={() => onRemove(img.id)}
                >
                  移除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
