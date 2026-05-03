export type InspireImage = {
  id: string;
  /** data URL（本機上傳）或 http(s) 圖片網址 */
  src: string;
  /** 來源標記（例如 Pinterest、品牌官網） */
  sourceLabel?: string;
};

/** 想在此空間擺放的家具（編輯頁填名稱／品牌／圖；moodboard 僅顯示圖） */
export type FurnitureItem = {
  id: string;
  name: string;
  brand: string;
  /** data URL 或代抓後的 data URL */
  imageSrc: string;
};

export type Room = {
  id: string;
  name: string;
  /** 文字需求／感覺描述 */
  notes: string;
  /** 希望避免的材質或視覺 */
  avoidNotes: string;
  styleTags: string[];
  colorTags: string[];
  images: InspireImage[];
  /** 舊資料可能無此欄，請用 `?? []` */
  furniture?: FurnitureItem[];
  createdAt: number;
  updatedAt: number;
};
