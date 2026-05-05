"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
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
  const { t } = useI18n();
  const mb = Math.round(MAX_IMAGE_BYTES / 1024 / 1024);
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [labelDraft, setLabelDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [urlFetching, setUrlFetching] = useState(false);

  async function onPickFiles(files: FileList | null) {
    setError(null);
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError(t("err.pickFile"));
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(t("err.fileTooLarge", { mb }));
        continue;
      }
      try {
        const src = await readFileAsDataUrl(file);
        onAdd({ src, sourceLabel: labelDraft.trim() || file.name });
      } catch {
        setError(t("err.readFail"));
      }
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
      setError(t("err.invalidUrl"));
      return;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      setError(t("err.httpOnly"));
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
        setError(data.error ?? t("err.downloadFail"));
        return;
      }
      if (!data.dataUrl) {
        setError(t("err.serverOdd"));
        return;
      }

      onAdd({
        src: data.dataUrl,
        sourceLabel: labelDraft.trim() || u.hostname,
      });
      setUrlDraft("");
    } catch {
      setError(t("err.offline"));
    } finally {
      setUrlFetching(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-ink">{t("insp.title")}</h2>
      <p className="text-sm text-ink-muted">{t("insp.subtitle")}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-peach/40 p-4 shadow-card">
          <p className="mb-2 text-xs font-medium text-ink-muted">
            {t("insp.localUpload")}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-on-accent file:hover:bg-accent-hover"
            onChange={(e) => void onPickFiles(e.target.files)}
          />
        </div>
        <div className="rounded-xl bg-peach/40 p-4 shadow-card">
          <p className="mb-2 text-xs font-medium text-ink-muted">
            {t("insp.imageUrl")}
          </p>
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
            {urlFetching ? t("insp.fetching") : t("insp.addUrl")}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-surface p-4 shadow-card">
        <label className="text-xs font-medium text-ink-muted">
          {t("insp.sourceLabel")}
        </label>
        <input
          value={labelDraft}
          onChange={(e) => setLabelDraft(e.target.value)}
          placeholder={t("insp.sourcePlaceholder")}
          className="mt-1 w-full rounded-lg border border-border-warm px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
        />
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-ink-soft">{t("insp.empty")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-lg bg-peach/30 shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt=""
                className="aspect-square w-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="flex items-center justify-between gap-1 bg-surface/95 px-2 py-1 text-[10px] text-ink-muted shadow-[0_-4px_12px_rgba(46,43,40,0.06)]">
                <span className="truncate">{img.sourceLabel ?? "—"}</span>
                <button
                  type="button"
                  className="shrink-0 text-danger hover:underline"
                  onClick={() => onRemove(img.id)}
                >
                  {t("insp.remove")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
