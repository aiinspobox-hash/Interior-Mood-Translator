import type { MessageKey } from "./dictionaries";
import { pickStrings } from "./dictionaries";
import type { AppLocale } from "./types";

/** {name} → 替換；未知鍵回退 zh-TW */
export function createTranslator(locale: AppLocale) {
  const primary = pickStrings(locale);
  const fallback = pickStrings("zh-TW");

  function t(key: MessageKey, vars?: Record<string, string | number>): string {
    let raw = primary[key] ?? fallback[key] ?? String(key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        raw = raw.split(`{${k}}`).join(String(v));
      }
    }
    return raw;
  }

  return t;
}
