"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExportAllRoomsPdfButton } from "@/components/home/ExportAllRoomsPdfButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SortableRoomList } from "@/components/home/SortableRoomList";
import { useI18n } from "@/contexts/I18nContext";
import { localizedSpacePresets } from "@/lib/i18n/presets";
import { DEFAULT_LOCALE } from "@/lib/i18n/types";
import { orderedRooms } from "@/lib/roomOrder";
import { useRoomStore } from "@/lib/store";

export function HomeClient() {
  const { t, locale } = useI18n();
  const spaceOptions = useMemo(
    () => localizedSpacePresets(locale),
    [locale],
  );
  const router = useRouter();
  const rooms = useRoomStore((s) => s.rooms);
  const roomOrder = useRoomStore((s) => s.roomOrder);
  const setRoomOrder = useRoomStore((s) => s.setRoomOrder);
  const addRoom = useRoomStore((s) => s.addRoom);
  const [name, setName] = useState("");
  const [preset, setPreset] = useState(
    () => localizedSpacePresets(DEFAULT_LOCALE)[0] ?? "",
  );

  useEffect(() => {
    setPreset(spaceOptions[0] ?? "");
  }, [spaceOptions]);

  function create(e: React.FormEvent) {
    e.preventDefault();
    const base = name.trim() || preset;
    const id = addRoom(base);
    setName("");
    router.push(`/room/${id}`);
  }

  const sorted = useMemo(
    () => orderedRooms(rooms, roomOrder),
    [rooms, roomOrder],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent-hover">
            {t("home.kicker")}
          </p>
          <h1 className="font-moodly mt-2 text-3xl font-semibold tracking-[0.01em] text-ink">
            {t("common.appName")}
          </h1>
          <p className="mt-3 max-w-xl whitespace-pre-line text-sm leading-relaxed text-ink-muted">
            {t("home.intro")}
          </p>
        </div>
        <LanguageSwitcher />
      </header>

      <section className="rounded-2xl bg-surface p-6 shadow-card">
        <h2 className="text-base font-semibold text-ink">{t("home.newSpace")}</h2>
        <form
          onSubmit={create}
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-1">
            <label
              htmlFor="preset"
              className="text-xs font-medium text-ink-soft"
            >
              {t("home.spaceType")}
            </label>
            <select
              id="preset"
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full rounded-lg border border-border-warm bg-surface px-3 py-2 text-sm text-ink outline-none ring-accent/25 focus:ring-2"
            >
              {spaceOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-[2] space-y-1">
            <label htmlFor="name" className="text-xs font-medium text-ink-soft">
              {t("home.displayName")}
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("home.namePlaceholder")}
              className="w-full rounded-lg border border-border-warm bg-app px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-on-accent shadow-card hover:bg-accent-hover"
          >
            {t("home.createEdit")}
          </button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="text-base font-semibold text-ink">{t("home.mySpaces")}</h2>
        {sorted.length === 0 ? (
          <p className="mt-4 rounded-xl bg-peach/25 py-12 text-center text-sm text-ink-soft shadow-card">
            {t("home.emptyRooms")}
          </p>
        ) : (
          <SortableRoomList rooms={sorted} onReorder={setRoomOrder} />
        )}
        {sorted.length > 0 ? (
          <div className="mt-6 flex justify-center">
            <ExportAllRoomsPdfButton rooms={sorted} />
          </div>
        ) : null}
      </section>
    </div>
  );
}
