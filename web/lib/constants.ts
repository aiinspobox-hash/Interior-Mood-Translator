/** 快速建立空間時可選的類型（仍可自訂名稱） */
export const SPACE_PRESETS = [
  "玄關",
  "客廳",
  "餐廳",
  "廚房",
  "主臥",
  "次臥",
  "書房",
  "浴室",
  "陽台",
  "多功能室",
  "其他",
] as const;

/** 手動標籤：風格／關鍵字建議（點擊加入） */
export const STYLE_SUGGESTIONS = [
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

/** 手動標籤：色系建議 */
export const COLOR_SUGGESTIONS = [
  "米白",
  "淺木",
  "灰",
  "奶茶",
  "黑色點綴",
  "低飽和",
  "大地色",
] as const;

/** 單張上傳建議上限（bytes） */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** Moodboard 網格最多展示張數 */
export const MOODBOARD_MAX_IMAGES = 12;

/** Moodboard 家具區最多展示張數（其餘仍保存在編輯清單） */
export const MOODBOARD_MAX_FURNITURE = 12;
