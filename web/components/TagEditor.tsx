"use client";

import { useCallback, useState } from "react";

type Props = {
  label: string;
  placeholder: string;
  suggestions: readonly string[];
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function TagEditor({
  label,
  placeholder,
  suggestions,
  tags,
  onChange,
}: Props) {
  const [draft, setDraft] = useState("");

  const addTag = useCallback(
    (raw: string) => {
      const t = raw.trim();
      if (!t || tags.includes(t)) return;
      onChange([...tags, t]);
      setDraft("");
    },
    [tags, onChange],
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink">{label}</label>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => addTag(s)}
            disabled={tags.includes(s)}
            className="rounded-full border border-border-sand bg-app px-3 py-1 text-xs text-ink-muted transition hover:bg-peach disabled:opacity-40"
          >
            + {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(draft);
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-lg border border-border-warm bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
        />
        <button
          type="button"
          onClick={() => addTag(draft)}
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover"
        >
          新增
        </button>
      </div>
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-1">
          {tags.map((t) => (
            <li
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-xs text-sage-ink"
            >
              {t}
              <button
                type="button"
                className="ml-0.5 rounded hover:bg-sage-ink/10"
                aria-label={`移除 ${t}`}
                onClick={() => onChange(tags.filter((x) => x !== t))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
