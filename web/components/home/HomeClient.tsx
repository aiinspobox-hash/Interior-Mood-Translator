"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ExportAllRoomsPdfButton } from "@/components/home/ExportAllRoomsPdfButton";
import { SortableRoomList } from "@/components/home/SortableRoomList";
import { SPACE_PRESETS } from "@/lib/constants";
import { orderedRooms } from "@/lib/roomOrder";
import { useRoomStore } from "@/lib/store";

export function HomeClient() {
  const router = useRouter();
  const rooms = useRoomStore((s) => s.rooms);
  const roomOrder = useRoomStore((s) => s.roomOrder);
  const setRoomOrder = useRoomStore((s) => s.setRoomOrder);
  const addRoom = useRoomStore((s) => s.addRoom);
  const [name, setName] = useState("");
  const [preset, setPreset] = useState<string>(SPACE_PRESETS[0]);

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
      <header className="mb-10">
        <p className="text-sm font-medium text-accent-hover">
          居家靈感 · 設計摘要
        </p>
        <h1 className="font-moodly mt-2 text-3xl font-semibold tracking-[0.01em] text-ink">
          Moodly
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          建立空間、收集靈感圖與標籤，預覽 moodboard 並匯出 PDF。
          資料儲存在此瀏覽器本機，清除網站資料會一併刪除。
        </p>
      </header>

      <section className="rounded-2xl bg-surface p-6 shadow-card">
        <h2 className="text-base font-semibold text-ink">新增空間</h2>
        <form
          onSubmit={create}
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-1">
            <label
              htmlFor="preset"
              className="text-xs font-medium text-ink-soft"
            >
              空間類型
            </label>
            <select
              id="preset"
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full rounded-lg border border-border-warm bg-surface px-3 py-2 text-sm text-ink outline-none ring-accent/25 focus:ring-2"
            >
              {SPACE_PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-[2] space-y-1">
            <label htmlFor="name" className="text-xs font-medium text-ink-soft">
              顯示名稱（可自訂，留空則用類型）
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：主玄關 + 穿鞋椅區"
              className="w-full rounded-lg border border-border-warm bg-app px-3 py-2 text-sm text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-on-accent shadow-card hover:bg-accent-hover"
          >
            建立並編輯
          </button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="text-base font-semibold text-ink">我的空間</h2>
        {sorted.length === 0 ? (
          <p className="mt-4 rounded-xl bg-peach/25 py-12 text-center text-sm text-ink-soft shadow-card">
            尚無空間，請先新增一個開始整理靈感。
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
