"use client";

import { useState } from "react";
import { DESIGN_BRIEF_EXPORT_ID } from "@/components/MoodboardPreview";

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
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      const maxHeight = pdf.internal.pageSize.getHeight() - margin * 2;

      let displayW = contentWidth;
      let displayH = imgHeight;
      if (displayH > maxHeight) {
        const ratio = maxHeight / displayH;
        displayW *= ratio;
        displayH = maxHeight;
      }

      pdf.addImage(imgData, "PNG", margin, margin, displayW, displayH);

      const safe = fileNameBase.replace(/[^\w\u4e00-\u9fff\-]+/g, "_");
      pdf.save(`design-brief-${safe || "room"}.pdf`);
    } catch (e) {
      console.error(e);
      setErr(
        "匯出失敗。若使用外部圖片網址，可能受跨網域限制；請改用上傳圖片。",
      );
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
