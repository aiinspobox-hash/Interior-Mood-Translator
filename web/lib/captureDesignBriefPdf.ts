import { sanitizeCloneForHtml2Canvas } from "@/lib/sanitizeForHtml2Canvas";
import { jsPDF } from "jspdf";

const HTML2CANVAS_OPTS = {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  backgroundColor: "#ffffff" as const,
  onclone: (clonedDoc: Document) => {
    sanitizeCloneForHtml2Canvas(clonedDoc);
  },
};

export async function captureElementToCanvas(
  el: HTMLElement,
): Promise<HTMLCanvasElement> {
  const html2canvas = (await import("html2canvas")).default;
  try {
    return await html2canvas(el, HTML2CANVAS_OPTS);
  } catch (firstErr) {
    console.warn("html2canvas retry with foreignObjectRendering", firstErr);
    return await html2canvas(el, {
      ...HTML2CANVAS_OPTS,
      foreignObjectRendering: true,
    });
  }
}

/** 將 canvas 依 A4 可視區等比縮放後畫在目前 PDF 頁面 */
export function fitCanvasOnCurrentPdfPage(
  pdf: InstanceType<typeof jsPDF>,
  canvas: HTMLCanvasElement,
  marginMm = 10,
): void {
  const imgData = canvas.toDataURL("image/png");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginMm * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;
  const maxHeight = pageHeight - marginMm * 2;

  let displayW = contentWidth;
  let displayH = imgHeight;
  if (displayH > maxHeight) {
    const ratio = maxHeight / displayH;
    displayW *= ratio;
    displayH = maxHeight;
  }

  pdf.addImage(imgData, "PNG", marginMm, marginMm, displayW, displayH);
}
