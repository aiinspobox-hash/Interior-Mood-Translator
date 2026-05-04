/**
 * 裝潢溝通指南文章：供 Landing「延伸閱讀」與 /articles/[slug] 共用。
 * 陣列順序第一則為精選大卡，其餘為右欄兩則。
 */

export type GuideArticleSection = {
  heading?: string;
  paragraphs: string[];
};

export type GuideArticle = {
  slug: string;
  title: string;
  excerpt: string;
  sections: GuideArticleSection[];
};

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "interior-designer-communication-brief",
    title: "如何與室內設計師溝通？一份完美的溝通簡報該包含什麼？",
    excerpt:
      "別再只丟照片給設計師了！學會結構化你的需求，讓專業設計師更懂你的心。",
    sections: [
      {
        paragraphs: [
          "許多人第一次找室內設計師時，手機裡塞滿了 Pinterest 截圖，見面卻說不出「我到底要什麼」。設計師不是讀心者；你越能把生活方式、預算範圍與「絕對不要」說清楚，初稿就越接近你心中的樣子。",
          "一份好用的溝通簡報，重點不在精美排版，而在資訊完整：空間用途、家庭成員與動線習慣、偏好色調與材質、以及參考圖背後你真正喜歡的是什麼（光線？留白？還是某種氛圍）。",
        ],
      },
      {
        heading: "簡報裡建議包含的區塊",
        paragraphs: [
          "空間與需求摘要：坪數、房型、主要使用者、是否需要大量收納或寵物友善等。",
          "視覺參考：每張圖加一句註解，例如「喜歡這個窗邊臥榻」比只貼圖有用。",
          "預算與時程：粗估總預算與希望完工時間，能幫助設計師選對施作深度與工法。",
          "地雷清單：討厭的顏色、材質或過去裝潢踩過的坑，能省下後來的大幅修改。",
        ],
      },
      {
        paragraphs: [
          "Moodly 的設計摘要與 PDF 匯出，正是為了把上述資訊收成一份設計師能快速閱讀的檔案。下次諮詢前，先整理好你的空間與靈感，再走進事務所，溝通會有效率得多。",
        ],
      },
    ],
  },
  {
    slug: "home-style-like-dislike",
    title: "居家風格斷捨離：教你定義喜歡與不喜歡的元素",
    excerpt:
      "用具體元素取代空泛風格標籤，並學會標註「不要什麼」，讓改造方向更精準。",
    sections: [
      {
        paragraphs: [
          "風格詞彙像「侘寂」「奶油風」常被濫用，真正影響居住感受的，往往是具體元素：木地板紋路、牆面是否留白、燈光色溫、傢俱線條是圓是方。",
          "試著把收藏圖分成兩堆：一堆一眼舒服、一堆說不上來但就是怪。接著寫下差異——多半會落在對比度、木色深淺、金屬比例等可描述的條目上。",
        ],
      },
      {
        heading: "不喜歡和喜歡同樣重要",
        paragraphs: [
          "在 Moodly 裡標註「避免項目」，不是挑剔，而是節省彼此時間。當你不喜歡深色木皮或某種燈具造型時，設計師就不會把力氣花在錯的方向上。",
        ],
      },
    ],
  },
  {
    slug: "rental-moodboard-on-budget",
    title: "小資族也能有質感：從 Moodboard 開始規劃你的租屋改造",
    excerpt:
      "在不能大改的前提下，用 moodboard 與採購順序，小預算也能拉齊整體感。",
    sections: [
      {
        paragraphs: [
          "租屋改造常卡在「不能敲不能鑿」，但質感多半來自軟裝與收納邏輯，而非大工程。先用 Moodboard 收斂色票與家具尺寸，再分批採購，較不會買到互相打架的單品。",
        ],
      },
      {
        heading: "預算有限時的順序建議",
        paragraphs: [
          "優先處理會大面積影響氛圍的項目：燈光、窗簾、大地毯或主牆色（若房東同意）。",
          "次要才是裝飾品；把預算留在你每天會看到的區域，例如床頭與主要休憩角。",
          "用 Moodly 匯出 PDF，方便與室友或伴侶對齊共識，再一起決定要最先下手的項目。",
        ],
      },
    ],
  },
];

export function getGuideArticleBySlug(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find((a) => a.slug === slug);
}
