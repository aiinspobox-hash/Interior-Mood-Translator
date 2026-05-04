"use client";

import { useRef, useState } from "react";
import { MAX_IMAGE_BYTES } from "@/lib/constants";
import type { FurnitureItem } from "@/lib/types";

type Props = {
  items: FurnitureItem[];
  onAdd: (item: Omit<FurnitureItem, "id">) => void;
  onRemove: (furnitureId: string) => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function FurnitureSection({ items, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [urlFetching, setUrlFetching] = useState(false);

  function resetForm() {
    setName("");
    setBrand("");
    setPendingSrc(null);
    setUrlDraft("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onPickFile(files: FileList | null) {
    setError(null);
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("請選擇圖片檔案");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`單張請小於 ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB`);
      return;
    }
    try {
      const src = await readFileAsDataUrl(file);
      setPendingSrc(src);
    } catch {
      setError("讀取圖片失敗");
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  async function addFromUrl() {
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

    setUrlFetching(true);
    try {
      const res = await fetch("/api/fetch-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });

      const data: { dataUrl?: string; error?: string } = await res.json();
      if (!res.ok) {
        setError(data.error ?? "下載圖片失敗");
        return;
      }
      if (!data.dataUrl) {
        setError("伺服器回應異常，請稍後再試");
        return;
      }

      setPendingSrc(data.dataUrl);
      setUrlDraft("");
    } catch {
      setError("無法連線，請確認已啟動開發伺服器或網路正常");
    } finally {
      setUrlFetching(false);
    }
  }

  function submitItem() {
    setError(null);
    const n = name.trim();
    if (!n) {
      setError("請填寫家具名稱");
      return;
    }
    if (!pendingSrc) {
      setError("請上傳圖片或貼上圖片網址並下載完成");
      return;
    }
    onAdd({ name: n, brand: brand.trim(), imageSrc: pendingSrc });
    resetForm();
  }

  const canSubmit = name.trim().length > 0 && pendingSrc !== null;

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-ink">家具／想要擺放的單品</h2>
      <p className="text-sm text-ink-muted">
        新增預計放入此空間的家具：至少填寫名稱並附上圖片（本機或網址）；品牌為選填。
        Moodboard 與 PDF 只會顯示圖片，方便討論視覺整合。
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-peach/40 p-4 shadow-card">
          <p className="mb-2 text-xs font-medium text-ink-muted">本機上傳</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-on-accent file:hover:bg-accent-hover"
            onChange={(e) => void onPickFile(e.target.files)}
          />
        </div>
        <div className="rounded-xl bg-peach/40 p-4 shadow-card">
          <p className="mb-2 text-xs font-medium text-ink-muted">圖片網址</p>
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://..."
            disabled={urlFetching}
            className="mb-2 w-full rounded-lg border border-border-warm bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2 disabled:opacity-60"
          />
          <button
            type="button"
            disabled={urlFetching}
            onClick={() => void addFromUrl()}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-60"
          >
            {urlFetching ? "下載圖片中…" : "使用網址圖片"}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-surface p-4 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-muted">家具名稱</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：餐椅"
              className="mt-1 w-full rounded-lg border border-border-warm px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted">
              品牌（選填）
            </label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="例：IKEA、Muuto"
              className="mt-1 w-full rounded-lg border border-border-warm px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
            />
          </div>
        </div>

        {pendingSrc && (
          <div className="mt-4 flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pendingSrc}
              alt=""
              className="h-24 w-24 shrink-0 rounded-lg object-cover shadow-sm"
              crossOrigin="anonymous"
            />
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-ink-muted">預覽：確認後按下「加入清單」</p>
              <button
                type="button"
                onClick={() => setPendingSrc(null)}
                className="self-start text-danger hover:underline"
              >
                清除圖片
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submitItem}
          className="mt-4 w-full rounded-full bg-accent py-2.5 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50"
        >
          加入清單
        </button>
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">尚無家具項目。</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((f) => (
            <li
              key={f.id}
              className="flex gap-3 overflow-hidden rounded-lg bg-peach/30 p-3 shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.imageSrc}
                alt=""
                className="h-20 w-20 shrink-0 rounded-md object-cover shadow-sm"
                crossOrigin="anonymous"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{f.name}</p>
                {f.brand ? (
                  <p className="truncate text-xs text-ink-muted">{f.brand}</p>
                ) : (
                  <p className="truncate text-xs text-ink-soft">未填品牌</p>
                )}
                <button
                  type="button"
                  className="mt-2 text-xs text-danger hover:underline"
                  onClick={() => onRemove(f.id)}
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
