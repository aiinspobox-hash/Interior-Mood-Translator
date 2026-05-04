"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { FurnitureSection } from "@/components/FurnitureSection";
import { InspirationImages } from "@/components/InspirationImages";
import { MoodboardPreview } from "@/components/MoodboardPreview";
import { TagEditor } from "@/components/TagEditor";
import { COLOR_SUGGESTIONS, STYLE_SUGGESTIONS } from "@/lib/constants";
import { useRoomStore } from "@/lib/store";

type Props = {
  roomId: string;
};

export function RoomEditor({ roomId }: Props) {
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
        <p className="text-ink-muted">找不到這個空間，可能已刪除或連結錯誤。</p>
        <Link
          href="/"
          className="mt-6 inline-block text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-link-hover"
        >
          回到首頁
        </Link>
      </div>
    );
  }

  const current = room;

  function confirmDelete() {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`確定刪除「${current.name}」？此動作無法復原。`)
    ) {
      return;
    }
    removeRoom(roomId);
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        aria-label="回到首頁"
        className="group mb-5 inline-flex items-center text-ink-soft transition hover:text-ink"
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

      <nav className="mb-8 text-sm text-ink-soft">
        <Link
          href="/"
          className="text-ink hover:text-link-hover hover:underline"
        >
          首頁
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{current.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <label className="text-xs font-medium text-ink-soft">空間名稱</label>
          <input
            value={current.name}
            onChange={(e) =>
              updateRoom(roomId, { name: e.target.value || "未命名空間" })
            }
            className="mt-1 block w-full max-w-md rounded-lg border border-border-warm bg-surface px-3 py-2 text-lg font-semibold text-ink outline-none ring-accent/25 focus:ring-2"
          />
        </div>
        <button
          type="button"
          onClick={confirmDelete}
          className="shrink-0 rounded-lg border border-red-200 bg-danger-surface px-4 py-2 text-sm text-danger hover:bg-red-100"
        >
          刪除此空間
        </button>
      </div>

      <div className="space-y-10">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-ink">文字需求</h2>
          <p className="text-sm text-ink-muted">
            描述風格、感覺、生活習慣與對這個空間的期待。
          </p>
          <textarea
            value={current.notes}
            onChange={(e) => updateRoom(roomId, { notes: e.target.value })}
            rows={5}
            placeholder="例：Japandi、溫暖、木質、乾淨、希望玄關有收納但不顯雜…"
            className="w-full rounded-xl border border-border-warm bg-surface px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-soft outline-none ring-accent/25 focus:ring-2"
          />
        </section>

        <section className="grid gap-8 rounded-2xl bg-peach/35 p-6 shadow-card">
          <TagEditor
            label="風格／關鍵字標籤"
            placeholder="輸入後按 Enter 或點「新增」"
            suggestions={STYLE_SUGGESTIONS}
            tags={current.styleTags}
            onChange={(styleTags) => updateRoom(roomId, { styleTags })}
          />
          <TagEditor
            label="色系標籤"
            placeholder="例：米白、淺木"
            suggestions={COLOR_SUGGESTIONS}
            tags={current.colorTags}
            onChange={(colorTags) => updateRoom(roomId, { colorTags })}
          />
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-ink">避免項目</h2>
          <textarea
            value={current.avoidNotes}
            onChange={(e) => updateRoom(roomId, { avoidNotes: e.target.value })}
            rows={3}
            placeholder="例：高對比色、亮面金屬、過多線板…"
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
