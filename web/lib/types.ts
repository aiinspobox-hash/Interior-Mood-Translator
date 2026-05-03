export type InspireImage = {
  id: string;
  /** data URL（本機上傳）或 http(s) 圖片網址 */
  src: string;
  /** 來源標記（例如 Pinterest、品牌官網） */
  sourceLabel?: string;
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
  createdAt: number;
  updatedAt: number;
};
