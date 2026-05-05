import { SPACE_PRESETS } from "@/lib/constants";
import type { AppLocale } from "./types";

/** 與 SPACE_PRESETS 索引對齊 */
const SPACE_LABELS_EN = [
  "Entry",
  "Living room",
  "Dining room",
  "Kitchen",
  "Primary bedroom",
  "Secondary bedroom",
  "Study",
  "Bathroom",
  "Balcony",
  "Multi-purpose",
  "Other",
] as const;

export function localizedSpacePresets(locale: AppLocale): string[] {
  if (locale === "en") {
    return [...SPACE_LABELS_EN];
  }
  return [...SPACE_PRESETS];
}

const STYLE_EN = [
  "Japandi",
  "Scandinavian",
  "Muji-like",
  "Modern minimalist",
  "Industrial",
  "Wabi-sabi",
  "American",
  "French",
  "Warm",
  "Clean",
  "Daylight",
  "Storage",
] as const;

const STYLE_ZH = [
  "Japandi",
  "北歐",
  "無印",
  "現代簡約",
  "工業風",
  "侘寂",
  "美式",
  "法式",
  "溫暖",
  "乾淨",
  "採光",
  "收納",
] as const;

const COLOR_EN = [
  "Off-white",
  "Light oak",
  "Gray",
  "Milk tea",
  "Black accents",
  "Low saturation",
  "Earth tones",
] as const;

const COLOR_ZH = ["米白", "淺木", "灰", "奶茶", "黑色點綴", "低飽和", "大地色"];

export function localizedStyleSuggestions(locale: AppLocale): readonly string[] {
  return locale === "en" ? STYLE_EN : STYLE_ZH;
}

export function localizedColorSuggestions(locale: AppLocale): readonly string[] {
  return locale === "en" ? COLOR_EN : COLOR_ZH;
}
