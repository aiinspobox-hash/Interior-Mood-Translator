import { NextRequest, NextResponse } from "next/server";

/** 與前端 MAX_IMAGE_BYTES 對齊 */
const MAX_BYTES = 4 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;

function isPrivateOrLocalHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h === "[::1]"
  ) {
    return true;
  }

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; /* CGNAT */
  }

  return false;
}

function sniffImageMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "image/jpeg";
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "image/png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46)
    return "image/gif";
  if (
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46
  )
    return "image/webp";
  return null;
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "無效的請求內容" }, { status: 400 });
  }

  const raw = body.url?.trim();
  if (!raw) {
    return NextResponse.json({ error: "缺少網址" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return NextResponse.json({ error: "網址格式不正確" }, { status: 400 });
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return NextResponse.json({ error: "僅支援 http / https" }, { status: 400 });
  }

  if (isPrivateOrLocalHost(url.hostname)) {
    return NextResponse.json({ error: "不允許此類網址" }, { status: 403 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `遠端回應 ${res.status}` },
        { status: 502 },
      );
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_BYTES) {
      return NextResponse.json(
        { error: `圖片超過 ${MAX_BYTES / 1024 / 1024}MB` },
        { status: 400 },
      );
    }

    const ctHeader = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    let mime = ctHeader.startsWith("image/") ? ctHeader : "";
    if (!mime) {
      mime = sniffImageMime(buf) ?? "";
    }
    if (!mime) {
      return NextResponse.json(
        { error: "無法辨識為圖片（Content-Type 非 image 且無法從內容判斷）" },
        { status: 400 },
      );
    }

    const base64 = buf.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;

    return NextResponse.json({ dataUrl });
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.name === "AbortError"
          ? "連線逾時"
          : e.message
        : "下載失敗";
    return NextResponse.json({ error: msg }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
