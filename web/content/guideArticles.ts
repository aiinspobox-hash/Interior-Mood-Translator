/**
 * 裝潢溝通指南文章：供 Landing「延伸閱讀」與 /articles/[slug] 共用。
 * 陣列順序第一則為精選大卡，其餘為右欄兩則。
 */

import type { AppLocale } from "@/lib/i18n/types";

export type GuideArticleSection = {
  heading?: string;
  paragraphs: string[];
};

export type GuideArticle = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  sections: GuideArticleSection[];
};

export const GUIDE_ARTICLES_ZH: GuideArticle[] = [
  {
    slug: "interior-designer-communication-brief",
    title: "別再只丟照片給設計師了！學會結構化你的需求，讓專業設計師更懂你的心",
    excerpt:
      "很多人在找室內設計師時，總以為只要在通訊軟體上狂丟幾十張 Pinterest 的漂亮照片，設計師就能瞬間「讀心」，把家變成理想中的模樣。",
    coverImage: "/landing/article-cover-communication.png",
    sections: [
      {
        paragraphs: [
          "事實上，這往往是溝通災難的開端。設計師每天看過成千上萬張精美圖庫，若你只給照片，他們看到的通常只是「表面風格」，而非「你的生活本質」。照片裡的客廳可能採光極佳，但你家可能面臨西曬；圖片中的開放式廚房美得像畫，但你不希望油煙影響到客廳。",
          "想要打造出真正適合你的居所，溝通的關鍵不在於「圖片搜集量」，而在於「結構化需求」。你必須學會把夢想轉化為具體的規格書，告訴設計師：你為什麼喜歡這張照片？是喜歡那個低飽和度的奶油色調，還是那個能收納雜物的隱藏櫃體？當你開始談論「機能」與「生活動線」時，設計師才真正進入了你的生活藍圖，這才是將美感落地為現實的第一步。",
        ],
      },
      {
        paragraphs: [
          "一份完美的溝通簡報，不只是裝潢的願望清單，它應該是一份關於「生活規律」的深度檔案。我建議你可以將簡報分為四大模組：第一是「成員與生活重心」，清楚標註家中有幾人、是否有寵物、平日最常活動的區域在哪（例如：你是常在家工作需要大書桌的軟體工程師，還是熱愛烹飪的料理狂人？）；第二是「空間機能細節」，不要只說「我要很多收納」，而要細化到「我要放吸塵器、行李箱，還有我的吉他收藏」；第三是「不可妥協的禁忌」，例如地板材質不能滑、不喜歡鏡面反射、對過多的木作有壓迫感，這些反面清單往往比喜歡什麼更重要；最後是「預算與優先級別」，將需求分為「絕對必須」與「若有餘裕再做」。",
          "透過這種結構化的呈現方式，你不再只是單方面提出要求，而是與設計師建立起一場「策略性對談」。這樣的簡報會讓設計師知道，你是一個對生活有明確洞察的業主，不僅能大幅縮短設計磨合期，還能避免在工程中途出現令人頭痛的設計變更。",
        ],
      },
      {
        paragraphs: [
          "最後，我想提醒大家，專業的室內設計其實是一場關於「信任與翻譯」的藝術。當你把結構化好的簡報遞給設計師時，請給予他們專業發揮的空間。我們的工作不是單純地把你的夢想清單逐一打勾，而是透過我們的經驗，去修正那些可能影響生活品質的盲點。有時候，你提出的想法在平面圖上可行，但在實際居住體驗中可能造成動線衝突，這時，設計師的專業反饋就是你最有價值的資產。",
          "溝通時，多用「因為我有……的需求，所以希望……」這樣的句型取代單向指令，你會發現，當設計師理解了你的需求邏輯，他們提出的解決方案將遠超你的想像。將溝通簡報當作你與設計師共同創作的橋樑，而不是單純的驗收標準。當你們在開會時不再只糾結於「這是什麼顏色」，而是深入討論「這塊區域如何支撐你未來的十年生活」時，你就知道，你已經成功駕馭了這場裝潢旅程，而你的夢想家，正一步步成形。",
        ],
      },
    ],
  },
  {
    slug: "home-style-like-dislike",
    title: "斷捨離不是丟棄，而是「風格的篩選」：定義你與家的深度共鳴",
    excerpt:
      "很多人對「斷捨離」有種誤解，以為這是一個殘酷的減法遊戲，要把家裡塞得滿滿的收藏全數清空才叫極簡。",
    coverImage: "/landing/article-cover-style.png",
    sections: [
      {
        paragraphs: [
          "但對室內設計而言，真正的斷捨離應該是「風格的精準校準」。當你面對琳瑯滿目的居家風格照片，卻感到迷惘時，你需要做的不是清掉雜物，而是定義「喜歡」與「不喜歡」的核心元素。試著拿出一張紙，將你看過的所有室內設計圖片，依照「想住進去」與「絕對不想要」進行分類。關鍵在於，別只看整體美感，請拆解細節：你討厭的是那個開放式衣櫃的凌亂感？還是討厭那種過於冷冽的工業風金屬質感？你喜歡的是那種暖陽灑進木地板的溫潤？還是那種極致純淨的留白空間？透過這種拆解，你會發現，你所嚮往的並不是某種特定的「網紅風格」，而是某種特定「生活狀態」的具象化。",
        ],
      },
      {
        paragraphs: [
          "當你開始釐清這些元素後，你會發現斷捨離的過程變得出奇順暢，因為你有了「判斷標準」。許多物品會留在生活中，往往是因為我們對風格的定義模糊，導致每一種風格的家具都買一點，最後家裡變成風格雜亂的展示場。這時，請運用「風格錨點」法：為你喜愛的空間風格設定三個關鍵詞，例如「溫暖、木質、通透」。當你準備進行斷捨離時，拿出任何一件舊家具或裝飾品，對照這三個詞彙。如果這件物品既不溫暖、不是木質，也不符合通透的需求，它就成了風格的「干擾源」。這不是在丟棄回憶，而是在把生活的畫布清理乾淨，讓真正屬於你風格的物品，有空間可以綻放。這是一個自我對話的過程，讓你從物品的奴隸，轉變為居家氛圍的策展人。",
        ],
      },
      {
        paragraphs: [
          "定義「不喜歡」的元素，往往比定義「喜歡」更具備建設性。在設計諮詢中，我常建議客戶製作一份「排斥清單（Anti-Wishlist）」。這份清單可以包含：我不喜歡深色地磚帶來的陰沉感、我不喜歡絨布材質容易過敏、我不喜歡複雜的線板裝飾……這些「不喜歡」其實就是你的「生活底線」。當你把這些底線畫出來，你便能保護自己不被流行趨勢誤導。很多人因為看了雜誌說法式復古風很紅，就強迫自己接受繁複的裝飾，最後卻覺得家裡看起來很雜亂。其實，那不是設計的問題，而是那種風格不符合你的底線。學會大膽地說「不」，是建立個人品味的最高級手段。當你明確知道哪些元素會摧毀你的情緒價值時，你對家的掌控感便會油然而生，風格自然也就定型了。",
        ],
      },
      {
        paragraphs: [
          "最後，斷捨離是一個動態循環，而非一次性的儀式。隨著你的年齡增長、興趣轉變，你的「風格定義」必然會跟著進化。可能二十五歲時你喜歡極簡主義帶來的冷靜，三十五歲後卻發現自己渴望更多溫馨的織品與層次感。這完全沒關係！重點在於你必須持續更新你的「風格檔案」。定期檢視家裡的物品，問自己：「這個東西現在還能支撐我想要的風格嗎？」如果答案是否定的，就勇敢地讓它離開。把家中每一件留下來的物品，視為你對生活的投資與選擇。透過這種有意識的篩選，你的家將不再只是睡覺的地方，而是一個能隨時為你充電、反映你真實內在的「能量場」。當你學會了篩選與定義，你會發現，家不僅僅是空間的組成，更是你靈魂的一種自我表達。",
        ],
      },
    ],
  },
  {
    slug: "rental-moodboard-on-budget",
    title: "小資族也能有質感：從 Moodboard 開始規劃你的租屋改造",
    excerpt:
      "身為小資族，租屋改造最常見的陷阱就是「邊買邊試」。看到網路上熱門的收納櫃就買一個，見到特價的裝飾燈就入手，結果住進去後發現家具風格不搭，不僅空間變得擁擠，預算也像流水般散去。",
    coverImage: "/landing/article-cover-rental.png",
    sections: [
      {
        paragraphs: [
          "想提升租屋的質感，關鍵絕對不是預算的多寡，而是規劃階段的「視覺錨點」。建議你在動工前，務必花時間製作一份屬於你的「Moodboard（情緒板）」。不用複雜的軟體，用手機截圖將心儀的色系、家具樣式、燈光氛圍全部集中在一個畫布上。這份 Moodboard 不僅是你的設計指南，更是你的購物預算控制員。當你看到一件極度誘人但風格不符的單品時，拿出來對照一下，你會發現大部分的「衝動購物」都會自動被過濾掉。這樣做，能確保你花出去的每一分錢，都是為了堆疊出你心中那個統一且和諧的夢想居所。",
          "在規劃 Moodboard 時，請將「色調」設為最高優先級別。小資族的空間通常受限，若色彩過於繁雜，視覺上會立刻顯得窄小且廉價。建議選擇一個「主色調」作為基礎，例如暖白色、奶茶色或淺灰，並搭配 10% 的「點綴色」來增加空間的層次感。請在 Moodboard 中明確標示出來：牆面的顏色、窗簾的材質、地毯的觸感，以及你能帶走的軟裝，如抱枕與掛畫。當色彩有了統一的秩序，即便你使用的是 IKEA 的平價家具，空間看起來也會因為「色彩美學」而產生高級的錯覺。此外，不要忘了規劃「光影布局」。租屋處的黃光管線通常冰冷且刺眼，透過 Moodboard 規劃幾盞落地燈或桌燈，讓光線分布在不同高度，能瞬間將廉價的租屋氣氛轉化為精緻的飯店感，這是最便宜卻最有效的質感升級手段。",
        ],
      },
    ],
  },
];

/** 英文版（slug 與中文版一致，便於同一 URL） */
export const GUIDE_ARTICLES_EN: GuideArticle[] = [
  {
    slug: "interior-designer-communication-brief",
    title: "How to talk with an interior designer? What belongs in a great brief?",
    excerpt:
      "Stop sending photos without context. Structure what you need so a pro can read you clearly.",
    coverImage: "/landing/article-cover-communication.png",
    sections: [
      {
        paragraphs: [
          "On a first visit, many people have a phone full of Pinterest but can’t name what they want. Designers aren’t mind readers—the clearer you are about daily life, budget, and “never do this,” the closer the first pass gets to the home in your head.",
          "A strong brief is less about pretty layout and more about completeness: how the space is used, who lives there, movement patterns, preferred tones and materials, and what you actually like in a reference (light, negative space, a certain mood).",
        ],
      },
      {
        heading: "Blocks to include",
        paragraphs: [
          "Space & needs: size, layout, who uses it, storage or pet needs, etc.",
          "Visual references: one line per image, e.g. “love this window seat” beats a raw image dump.",
          "Budget & schedule: ballpark total and target finish date so the studio can match scope and methods.",
          "No-go list: colors, materials, or past remodel pain points that you want to avoid up front.",
        ],
      },
      {
        paragraphs: [
          "Moodly’s design summary and PDF export package that information for a quick read. Before the next meeting, line up your space and inspiration so the conversation stays efficient.",
        ],
      },
    ],
  },
  {
    slug: "home-style-like-dislike",
    title: "Style declutter: name what you like and what you don’t",
    excerpt:
      "Replace vague style labels with concrete elements—and say what to avoid—to steer decisions.",
    coverImage: "/landing/article-cover-style.png",
    sections: [
      {
        paragraphs: [
          "Buzzwords like “wabi” or “cream kitchen” get overused; what you feel day to day is usually concrete: floor grain, wall quietness, light temperature, furniture curves versus edges.",
          "Sort saves into two piles—comfortable at first glance versus subtly “off.” Write what differs—often contrast, wood depth, or metal ratio.",
        ],
      },
      {
        heading: "Dislikes matter as much as likes",
        paragraphs: [
          "Marking “Avoid” in Moodly isn’t picky—it saves time. If you dislike dark veneer or a certain fixture silhouette, your designer won’t push effort in the wrong direction.",
        ],
      },
    ],
  },
  {
    slug: "rental-moodboard-on-budget",
    title: "Quality on a budget: plan a rental refresh from a moodboard",
    excerpt:
      "When you can’t renovate hard, moodboards and purchase order still pull a cohesive look together.",
    coverImage: "/landing/article-cover-rental.png",
    sections: [
      {
        paragraphs: [
          "Rentals often mean no demolition—yet the feeling usually comes from soft furnishings and storage logic, not heavy construction. Start with a moodboard to lock palette and furniture scale, then buy in phases so pieces don’t fight each other.",
        ],
      },
      {
        heading: "Where to spend first on a tight budget",
        paragraphs: [
          "Prioritize what sets the mood across the room: lighting, curtains, a large rug, or a main wall color (if allowed).",
          "Decor comes after; put money where you spend time daily—bed zone and main lounge corner.",
          "Export a PDF from Moodly to align with roommates or partners before you buy.",
        ],
      },
    ],
  },
];

/** @deprecated 請優先使用 getGuideArticles；保留給舊 import */
export const GUIDE_ARTICLES = GUIDE_ARTICLES_ZH;

export function getGuideArticles(locale: AppLocale): GuideArticle[] {
  return locale === "en" ? GUIDE_ARTICLES_EN : GUIDE_ARTICLES_ZH;
}

export function getGuideArticleBySlug(
  slug: string,
  locale: AppLocale = "zh-TW",
): GuideArticle | undefined {
  return getGuideArticles(locale).find((a) => a.slug === slug);
}
