"use client";

import { useState } from "react";
import { MoodboardPreview } from "@/components/MoodboardPreview";
import {
  captureElementToCanvas,
  fitCanvasOnCurrentPdfPage,
} from "@/lib/captureDesignBriefPdf";
import type { Room } from "@/lib/types";
import { jsPDF } from "jspdf";

export function exportDomIdForRoom(roomId: string) {
  return `design-brief-export-${roomId}`;
}

type Props = {
  rooms: Room[];
};

export function ExportAllRoomsPdfButton({ rooms }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (rooms.length === 0) return null;

  async function exportAll() {
    setErr(null);
    setBusy(true);
    try {
      // 離屏 Moodboard 需時間跑色票與版面
      await new Promise((r) => setTimeout(r, 500));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let firstPage = true;
      for (let i = 0; i < rooms.length; i++) {
        const r = rooms[i];
        const el = document.getElementById(exportDomIdForRoom(r.id));
        if (!el) continue;
        if (!firstPage) pdf.addPage();
        const canvas = await captureElementToCanvas(el as HTMLElement);
        fitCanvasOnCurrentPdfPage(pdf, canvas);
        firstPage = false;
        if (i < rooms.length - 1) {
          await new Promise((res) => setTimeout(res, 100));
        }
      }

      if (firstPage) {
        setErr("找不到可匯出的內容，請重新整理頁面後再試。");
        return;
      }

      const stamp = new Date().toISOString().slice(0, 10);
      pdf.save(`moodly-all-spaces-${stamp}.pdf`);
    } catch (e) {
      console.error(e);
      setErr("批次匯出失敗，請稍後再試或減少圖片數量。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed left-[-12000px] top-0 z-0 w-[min(896px,calc(100vw-32px))] space-y-10 py-6"
      >
        {rooms.map((r) => (
          <MoodboardPreview
            key={r.id}
            room={r}
            exportElementId={exportDomIdForRoom(r.id)}
            showHeading={false}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void exportAll()}
          className="inline-flex w-fit items-center justify-center rounded-full bg-surface px-5 py-2.5 text-sm font-medium text-ink shadow-card transition hover:bg-peach/40 hover:shadow-lg disabled:opacity-60"
        >
          {busy ? "產生 PDF 中…" : "匯出全部空間 PDF"}
        </button>
        {err && (
          <p className="text-sm text-danger" role="alert">
            {err}
          </p>
        )}
      </div>
    </>
  );
}
