/**
 * html2canvas 無法解析 lab()/lch()/oklch() 等色彩；Chromium 的 getComputedStyle
 * 常回傳 lab(...)。更嚴重的是：parse 階段會先處理 clone 內整份文件的
 * documentElement / body 背景等，只處理 #design-brief-export 子樹不夠。
 * 此處在 onclone 內掃描「整份複製文件」，把新式色彩轉成 rgb/#hex 或安全地拿掉。
 */

const COLOR_PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "columnRuleColor",
  "caretColor",
] as const;

function cssPropKebab(name: string): string {
  return name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function likelyModernColorFunction(value: string): boolean {
  return /\b(?:lab|lch|oklch|oklab|color)\(/i.test(value.trim());
}

function convertWithCanvas(
  ctx: CanvasRenderingContext2D,
  value: string,
): string | null {
  const v = value.trim();
  if (!v || v === "transparent") return null;
  if (!likelyModernColorFunction(v)) return null;
  try {
    ctx.fillStyle = "#000000";
    ctx.fillStyle = v;
    const out = ctx.fillStyle;
    if (typeof out === "string" && !likelyModernColorFunction(out)) {
      return out;
    }
  } catch {
    return null;
  }
  return null;
}

const SHADOW_LIKE = ["box-shadow", "text-shadow"] as const;
const STRIP_IF_MODERN = [
  "background-image",
  "filter",
  "backdrop-filter",
] as const;

/**
 * 掃描 html2canvas 複製出來的整份文件（含 html、body 與 #design-brief-export），
 * 必須在 parseTree 前執行，否則 parseBackgroundColor 仍會因 lab() 拋錯。
 */
export function sanitizeCloneForHtml2Canvas(clonedDoc: Document): void {
  const win = clonedDoc.defaultView;
  if (!win) return;

  const canvas = clonedDoc.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const sanitizeEl = (el: HTMLElement) => {
    const cs = win.getComputedStyle(el);

    for (const prop of COLOR_PROPS) {
      const kebab = cssPropKebab(prop);
      const val = cs.getPropertyValue(kebab);
      let fixed = convertWithCanvas(ctx, val);
      if (!fixed && likelyModernColorFunction(val)) {
        if (prop === "color") fixed = "#333333";
        else if (prop === "backgroundColor") fixed = "#ffffff";
        else fixed = "#cccccc";
      }
      if (fixed) {
        el.style.setProperty(kebab, fixed, "important");
      }
    }

    for (const prop of SHADOW_LIKE) {
      const val = cs.getPropertyValue(prop);
      if (val && val !== "none" && likelyModernColorFunction(val)) {
        el.style.setProperty(prop, "none", "important");
      }
    }

    for (const prop of STRIP_IF_MODERN) {
      const val = cs.getPropertyValue(prop);
      if (val && val !== "none" && likelyModernColorFunction(val)) {
        el.style.setProperty(prop, "none", "important");
      }
    }
  };

  const walk = (node: Element) => {
    if (node instanceof HTMLElement) {
      sanitizeEl(node);
    }
    for (const child of node.children) {
      walk(child);
    }
  };

  const root = clonedDoc.documentElement;
  if (root) {
    walk(root);
  }
}
