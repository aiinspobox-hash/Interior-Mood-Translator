/** 從一張或多張圖片網址／Data URL 抽取代表色（瀏覽器端 Canvas 取樣） */

const DEFAULT_MAX_COLORS = 5;
/** 縮放後長邊上限，兼顾效能與代表性 */
const MAX_CANVAS_SIDE = 120;
/** RGB 分桶寬度（越小色票越多顆粒） */
const QUANT = 10;
/** 與已選色相距過近則略過（RGB 空間） */
const MIN_COLOR_DISTANCE = 30;

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((n) => clamp255(n).toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function colorDistanceHex(a: string, b: string): number {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  if (!A || !B) return 999;
  const dr = A[0] - B[0];
  const dg = A[1] - B[1];
  const db = A[2] - B[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("無法載入圖片"));
    img.src = src;
  });
}

async function sampleImageData(src: string): Promise<ImageData | null> {
  try {
    const img = await loadImage(src);
    const w0 = img.naturalWidth;
    const h0 = img.naturalHeight;
    if (!w0 || !h0) return null;

    let w = w0;
    let h = h0;
    const scale = Math.min(1, MAX_CANVAS_SIDE / Math.max(w0, h0));
    w = Math.max(1, Math.round(w0 * scale));
    h = Math.max(1, Math.round(h0 * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  } catch {
    return null;
  }
}

type Bucket = { r: number; g: number; b: number; count: number };

/**
 * 從多張圖片合併統計後取出最常見且彼此區隔的色票。
 */
export async function extractPaletteFromImageSources(
  sources: string[],
  maxColors = DEFAULT_MAX_COLORS,
): Promise<string[]> {
  if (sources.length === 0) return [];

  const buckets = new Map<string, Bucket>();

  for (const src of sources) {
    const imageData = await sampleImageData(src);
    if (!imageData) continue;

    const { data, width, height } = imageData;
    const pixelCount = width * height;
    const stride = Math.max(1, Math.floor(pixelCount / 3000));

    for (let p = 0; p < pixelCount; p += stride) {
      const i = p * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 85) continue;

      const brightness = (r + g + b) / 3;
      if (brightness > 250) continue;
      if (brightness < 12) continue;

      const qr =
        Math.floor(r / QUANT) * QUANT + Math.floor(QUANT / 2);
      const qg =
        Math.floor(g / QUANT) * QUANT + Math.floor(QUANT / 2);
      const qb =
        Math.floor(b / QUANT) * QUANT + Math.floor(QUANT / 2);
      const key = `${qr}|${qg}|${qb}`;
      const cur = buckets.get(key);
      if (cur) cur.count += 1;
      else buckets.set(key, { r: qr, g: qg, b: qb, count: 1 });
    }
  }

  const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);
  const result: string[] = [];

  for (const c of sorted) {
    if (result.length >= maxColors) break;
    const hex = rgbToHex(c.r, c.g, c.b);
    const tooClose = result.some(
      (h) => colorDistanceHex(hex, h) < MIN_COLOR_DISTANCE,
    );
    if (!tooClose) result.push(hex);
  }

  return result;
}
