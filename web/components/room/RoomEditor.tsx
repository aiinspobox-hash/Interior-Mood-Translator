"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { FurnitureSection } from "@/components/FurnitureSection";
import { InspirationImages } from "@/components/InspirationImages";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MoodboardPreview } from "@/components/MoodboardPreview";
import { TagEditor } from "@/components/TagEditor";
import { useI18n } from "@/contexts/I18nContext";
import {
  localizedColorSuggestions,
  localizedStyleSuggestions,
} from "@/lib/i18n/presets";
import { useRoomStore } from "@/lib/store";

type Props = {
  roomId: string;
};

export function RoomEditor({ roomId }: Props) {
  const { t, locale } = useI18n();
  const styleSuggestions = useMemo(
    () => localizedStyleSuggestions(locale),
    [locale],
  );
  const colorSuggestions = useMemo(
    () => localizedColorSuggestions(locale),
    [locale],
  );
  const router = useRouter();
  const room = useRoomStore((s) => s.rooms.find((r) => r.id === roomId));
  const updateRoom = useRoomStore((s) => s.updateRoom);
  const removeRoom = useRoomStore((s) => s.removeRoom);
  const addImage = useRoomStore((s) => s.addImage);
  const removeImage = useRoomStore((s) => s.removeImage);
  const addFurniture = useRoomStore((s) => s.addFurniture);
  const removeFurniture = useRoomStore((s) => s.removeFurniture);

  if (!room) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-ink-muted">{t("room.notFound")}</p>
        <Link
          href="/"
          className="mt-6 inline-block text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-link-hover"
        >
          {t("room.backHome")}
        </Link>
      </div>
    );
  }

  const current = room;

  function confirmDelete() {
    if (
      typeof window !== "undefined" &&
      !window.confirm(t("room.deleteConfirm", { name: current.name }))
    ) {
      return;
    }
    removeRoom(roomId);
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-5 flex items-start justify-between gap-4">
      <Link
        href="/"
        aria-label={t("room.backHomeAria")}
        className="group inline-flex items-center text-ink-soft transition hover:text-ink"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </Link>
      <LanguageSwitcher />
      </div>

      <nav className="mb-8 text-sm text-ink-soft">
        <Link
          href="/"
          className="text-ink hover:text-link-hover hover:underline"
        >
          {t("room.breadcrumbHome")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{current.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <label className="text-xs font-medium text-ink-soft">
            {t("room.nameLabel")}
          </label>
          <input
            value={current.name}
            onChange={(e) =>
              updateRoom(roomId, { name: e.target.value || t("room.unnamed") })
            }
            className="mt-1 block w-full max-w-md rounded-lg border border-border-warm bg-surface px-3 py-2 text-lg font-semibold text-ink outline-none ring-accent/25 focus:ring-2"
          />
        </div>
        <button
          type="button"
          onClick={confirmDelete}
          className="shrink-0 rounded-lg border border-red-200 bg-danger-surface px-4 py-2 text-sm text-danger hover:bg-red-100"
        >
          {t("room.delete")}
        </button>
      </div>

      <div className="space-y-10">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-ink">{t("room.notesHeading")}</h2>
          <p className="text-sm text-ink-muted">{t("room.notesHint")}</p>
          <textarea
            value={current.notes}
            onChange={(e) => updateRoom(roomId, { notes: e.target.value })}
            rows={5}
            placeholder={t("room.notesPlaceholder")}
            className="w-full rounded-xl border border-border-warm bg-surface px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
          />
        </section>

        <section className="grid gap-8 rounded-2xl bg-peach/35 p-6 shadow-card">
          <TagEditor
            label={t("room.styleTags")}
            placeholder={t("room.styleTagsPh")}
            suggestions={styleSuggestions}
            tags={current.styleTags}
            onChange={(styleTags) => updateRoom(roomId, { styleTags })}
            addButtonLabel={t("tag.add")}
            removeAriaLabel={(tag) => t("tag.removeAria", { name: tag })}
          />
          <TagEditor
            label={t("room.colorTags")}
            placeholder={t("room.colorTagsPh")}
            suggestions={colorSuggestions}
            tags={current.colorTags}
            onChange={(colorTags) => updateRoom(roomId, { colorTags })}
            addButtonLabel={t("tag.add")}
            removeAriaLabel={(tag) => t("tag.removeAria", { name: tag })}
          />
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-ink">{t("room.avoidHeading")}</h2>
          <textarea
            value={current.avoidNotes}
            onChange={(e) => updateRoom(roomId, { avoidNotes: e.target.value })}
            rows={3}
            placeholder={t("room.avoidPlaceholder")}
            className="w-full rounded-xl border border-border-warm bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
          />
        </section>

        <InspirationImages
          images={current.images}
          onAdd={(img) => addImage(roomId, img)}
          onRemove={(imageId) => removeImage(roomId, imageId)}
        />

        <FurnitureSection
          items={current.furniture ?? []}
          onAdd={(item) => addFurniture(roomId, item)}
          onRemove={(furnitureId) => removeFurniture(roomId, furnitureId)}
        />

        <MoodboardPreview room={current} />

        <ExportPdfButton fileNameBase={current.name} />
      </div>
    </div>
  );
}
