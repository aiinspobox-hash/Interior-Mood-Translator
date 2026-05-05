"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import type { AppLocale } from "@/lib/i18n/types";

const OPTIONS: { id: AppLocale; labelKey: "lang.zh" | "lang.en" }[] = [
  { id: "zh-TW", labelKey: "lang.zh" },
  { id: "en", labelKey: "lang.en" },
];

type Props = {
  /** 置頂導覽用較小對比 */
  variant?: "default" | "nav";
};

export function LanguageSwitcher({ variant = "default" }: Props) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const triggerClass =
    variant === "nav"
      ? "border-white/25 bg-black/15 text-white/95 backdrop-blur-sm hover:bg-black/25 focus-visible:ring-white/40"
      : "border-border-warm bg-surface text-ink hover:bg-peach/25 focus-visible:ring-accent/40";

  const panelClass =
    variant === "nav"
      ? "border-white/20 bg-surface/95 text-ink"
      : "border-border-warm bg-surface text-ink";

  const currentShort = locale === "zh-TW" ? "中" : "EN";

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={wrapRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("lang.label")}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm transition outline-none focus-visible:ring-2 sm:px-3 sm:text-sm ${triggerClass}`}
      >
        <span>{currentShort}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9Z" />
        </svg>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute right-0 z-50 mt-2 min-w-28 overflow-hidden rounded-xl border p-1 shadow-card ${panelClass}`}
        >
          {OPTIONS.map(({ id, labelKey }) => {
            const active = locale === id;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setLocale(id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition sm:text-sm ${
                  active ? "bg-peach/35 text-ink" : "hover:bg-peach/20"
                }`}
              >
                <span>{t(labelKey)}</span>
                {active ? <span className="text-[10px] text-accent-hover">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
