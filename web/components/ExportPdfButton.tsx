"use client";

import { useState } from "react";
import { DESIGN_BRIEF_EXPORT_ID } from "@/components/MoodboardPreview";
import {
  captureElementToCanvas,
  fitCanvasOnCurrentPdfPage,
} from "@/lib/captureDesignBriefPdf";
import { jsPDF } from "jspdf";

type Props = {
  fileNameBase: string;
};

export function ExportPdfButton({ fileNameBase }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function exportPdf() {
    setErr(null);
    const el = document.getElementById(DESIGN_BRIEF_EXPORT_ID);
    if (!el) {
      setErr("找不到匯出區塊");
      return;
    }
    setBusy(true);
    try {
      const canvas = await captureElementToCanvas(el as HTMLElement);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      fitCanvasOnCurrentPdfPage(pdf, canvas);

      const safe = fileNameBase.replace(/[^\w\u4e00-\u9fff\-]+/g, "_");
      pdf.save(`design-brief-${safe || "room"}.pdf`);
    } catch (e) {
      console.error(e);
      setErr("匯出失敗。請重新整理頁面後再試，或減少圖片數量。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void exportPdf()}
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent shadow-card hover:bg-accent-hover disabled:opacity-60"
      >
        {busy ? "產生 PDF 中…" : "匯出 PDF"}
      </button>
      {err && (
        <p className="text-sm text-danger" role="alert">
          {err}
        </p>
      )}
    </div>
  );
}
