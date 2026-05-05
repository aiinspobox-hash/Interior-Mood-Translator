import type { AppLocale } from "./types";

/**
 * 中英譯文鍵必須一一對應；翻譯函式會依 locale 取值。
 * 字串內可用 {name}、{count} 等變數標記（見 createTranslator）。
 */
export const STRINGS_ZH_TW = {
  // —— common
  "common.appName": "Moodly",
  "common.loading": "載入本機資料…",

  // —— language switcher
  "lang.label": "語言",
  "lang.zh": "繁中",
  "lang.en": "English",

  // —— home
  "home.kicker": "居家靈感 · 設計摘要",
  "home.intro":
    "建立空間、收集靈感圖與標籤，預覽 moodboard 並匯出 PDF。\n資料儲存在此瀏覽器本機，清除網站資料會一併刪除。",
  "home.newSpace": "新增空間",
  "home.spaceType": "空間類型",
  "home.displayName": "顯示名稱（可自訂，留空則用類型）",
  "home.namePlaceholder": "例：主玄關 + 穿鞋椅區",
  "home.createEdit": "建立並編輯",
  "home.mySpaces": "我的空間",
  "home.emptyRooms": "尚無空間，請先新增一個開始整理靈感。",

  // —— room editor
  "room.notFound": "找不到這個空間，可能已刪除或連結錯誤。",
  "room.backHome": "回到首頁",
  "room.backHomeAria": "回到首頁",
  "room.breadcrumbHome": "首頁",
  "room.nameLabel": "空間名稱",
  "room.delete": "刪除此空間",
  "room.deleteConfirm": "確定刪除「{name}」？此動作無法復原。",
  "room.notesHeading": "文字需求",
  "room.notesHint": "描述風格、感覺、生活習慣與對這個空間的期待。",
  "room.notesPlaceholder":
    "例：Japandi、溫暖、木質、乾淨、希望玄關有收納但不顯雜…",
  "room.styleTags": "風格／關鍵字標籤",
  "room.styleTagsPh": "輸入後按 Enter 或點「新增」",
  "room.colorTags": "色系標籤",
  "room.colorTagsPh": "例：米白、淺木",
  "room.avoidHeading": "避免項目",
  "room.avoidPlaceholder": "例：高對比色、亮面金屬、過多線板…",
  "room.unnamed": "未命名空間",

  // —— inspiration images
  "insp.title": "靈感圖片",
  "insp.subtitle":
    "上傳檔案，或貼上圖片 URL（系統會由伺服器下載並轉成可匯出 PDF 的格式）。可選填來源標記（品牌、平台）。",
  "insp.localUpload": "本機上傳",
  "insp.imageUrl": "圖片網址",
  "insp.fetching": "下載圖片中…",
  "insp.addUrl": "加入網址圖片",
  "insp.sourceLabel": "來源標記（選填，套用於接下來新增的圖片）",
  "insp.sourcePlaceholder": "例：Pinterest、品牌官網",
  "insp.empty": "尚無圖片，請先上傳或加入網址。",
  "insp.remove": "移除",
  "err.pickFile": "請選擇圖片檔案",
  "err.fileTooLarge": "單張請小於 {mb}MB",
  "err.readFail": "讀取圖片失敗",
  "err.invalidUrl": "請輸入有效的 http(s) 圖片網址",
  "err.httpOnly": "僅支援 http / https",
  "err.downloadFail": "下載圖片失敗",
  "err.serverOdd": "伺服器回應異常，請稍後再試",
  "err.offline": "無法連線，請確認已啟動開發伺服器或網路正常",

  // —— furniture
  "fur.title": "家具／想要擺放的單品",
  "fur.subtitle":
    "新增預計放入此空間的家具：至少填寫名稱並附上圖片（本機或網址）；品牌為選填。Moodboard 與 PDF 只會顯示圖片，方便討論視覺整合。",
  "fur.useUrl": "使用網址圖片",
  "fur.itemName": "家具名稱",
  "fur.itemPlaceholder": "例：餐椅",
  "fur.brand": "品牌（選填）",
  "fur.brandPlaceholder": "例：IKEA、Muuto",
  "fur.previewHint": "預覽：確認後按下「加入清單」",
  "fur.clearImage": "清除圖片",
  "fur.addToList": "加入清單",
  "fur.empty": "尚無家具項目。",
  "fur.noBrand": "未填品牌",
  "fur.needName": "請填寫家具名稱",
  "fur.needImage": "請上傳圖片或貼上圖片網址並下載完成",

  // —— moodboard preview
  "mb.briefLine": "Moodly · Design Brief",
  "mb.notes": "文字需求",
  "mb.styleTags": "風格／關鍵字",
  "mb.colorTags": "色系標籤",
  "mb.avoid": "避免項目",
  "mb.dash": "—",
  "mb.inspirationTitle": "INSPIRATION IMAGES",
  "mb.noImages": "尚無圖片",
  "mb.moreImages":
    "另有 {count} 張未放入拼貼（單頁最多 {max} 張）",
  "mb.moreFurniture":
    "另有 {count} 件家具圖未放入拼貼（單頁最多 {max} 張）",
  "mb.paletteTitle": "COLOR PALETTE",
  "mb.paletteHint": "依靈感圖片自動萃取 5 色",
  "mb.noPalette": "尚無圖片，無法產生色票",
  "mb.paletteLoading": "分析圖片色調中…",
  "mb.paletteFail": "無法從目前圖片萃取色票（可能為載入限制）",
  "mb.footerEn": "Design summary — for discussion purposes only.",
  "mb.footerZh": "設計摘要 · 供討論使用。",
  "mb.sectionTitle": "Moodboard 預覽（匯出 PDF 使用此區）",

  // —— export pdf
  "pdf.export": "匯出 PDF",
  "pdf.exporting": "產生 PDF 中…",
  "pdf.exportFail":
    "匯出失敗。請重新整理頁面後再試，或減少圖片數量。",
  "pdf.noBlock": "找不到匯出區塊",
  "pdf.allRooms": "匯出全部空間 PDF",
  "pdf.allEmpty": "找不到可匯出的內容，請重新整理頁面後再試。",
  "pdf.allFail": "批次匯出失敗，請稍後再試或減少圖片數量。",

  // —— tag editor
  "tag.add": "新增",
  "tag.removeAria": "移除 {name}",

  // —— sortable room list
  "sort.drag": "拖移排序：{name}",
  "sort.imagesMeta": "{count} 張圖 · {date}",
  "sort.edit": "編輯 →",
  "sort.moveUp": "將「{name}」上移",
  "sort.moveDown": "將「{name}」下移",
  "sort.deleteConfirm":
    "確定要刪除「{name}」嗎？此空間內的靈感與設定會一併從本機移除，且無法復原。",
  "sort.delete": "刪除",
  "sort.deleteAria": "刪除空間：{name}",

  // —— landing (selected large strings)
  "landing.nav.open": "開啟選單",
  "landing.nav.close": "關閉選單",
  "landing.nav.main": "主要導覽",
  "landing.cta.start": "開始使用",
  "landing.hero.badge": "居家靈感 · 設計摘要",
  "landing.hero.title": "把裝潢靈感，整理成看得懂的 moodboard。",
  "landing.hero.sub":
    "讓你的裝潢靈感不再零散。從破碎的收藏，到精準的設計摘要，Moodly 幫你精準傳達對家的所有想像。",
  "landing.hero.ctaPrimary": "開始使用",
  "landing.hero.ctaSecondary": "了解能幫你什麼",
  "landing.hero.carousel": "切換主視覺",
  "landing.hero.prev": "上一張",
  "landing.hero.prevAria": "上一張",
  "landing.hero.next": "下一張 →",
  "landing.hero.nextAria": "下一張",
  "landing.trust": "合作與背書",
  "landing.value.title":
    "把雜亂的靈感，變成設計師一眼就懂的溝通語言。",
  "landing.value.p1":
    "痛點與對應：你是否收藏了無數張 Pinterest 美圖，卻無法描述出真正的喜好？面對設計師時，總怕表達不完整導致成品有落差？Moodly 協助你將散亂的截圖與關鍵字系統化，自動生成專業的「設計摘要」，讓溝通效率翻倍。",
  "landing.value.p2":
    "適用情境：無論是準備翻新舊屋、買了新房想進行裝潢，還是小資租屋族的輕改造，在尋求專業諮詢前，先用 Moodly 梳理你的居家藍圖，讓每一分預算都花在心坎上。",
  "landing.how.title": "如何使用 Moodly",
  "landing.how.sub": "簡單三步驟，完成你的專屬室內設計溝通檔案。",
  "landing.how.stepLabel": "步驟 {step}：",
  "landing.how.more": "了解更多 →",
  "landing.voices.title": "超過 500 位使用者的裝潢起點",
  "landing.voices.prev": "上一則",
  "landing.voices.next": "下一則",
  "landing.grid.title": "從收藏到共識，最常見的四個卡點",
  "landing.grid.sub":
    "以下對應 Moodly 的核心流程與功能設計，讓你快速掃讀我們如何收斂糾結。",
  "landing.grid.cta": "查看 →",
  "landing.guide.kicker": "Moodly 裝潢溝通指南",
  "landing.guide.title": "延伸閱讀",
  "landing.guide.tip":
    "小貼士：上傳圖片建議為 JPG 或 PNG 格式，並建議在完成初步規劃後，儘早匯出 PDF 備份您的資料喔！",
  "landing.guide.read": "閱讀全文 →",
  "landing.guide.readAria": "閱讀：{title}",
  "landing.cta2.title": "準備好開始整理了嗎？",
  "landing.cta2.body":
    "無需註冊，直接在瀏覽器建立你的第一個空間，開始規劃你的夢想居家。",
  "landing.cta2.btn": "立即體驗",
  "landing.cta2.before": "靈感分散、無從下手",
  "landing.cta2.after": "一頁整理好你的空間方向",
  "landing.cta3.title": "關於 Moodly",
  "landing.cta3.body":
    "我們相信，每個人都值得擁有理想的生活空間，而這一切就從釐清需求開始。",
  "landing.cta3.btn": "品牌理念",
  "landing.cta3.titleAttr": "了解更多",
  "landing.cta3.before": "喜歡與不喜歡混在一起",
  "landing.cta3.after": "偏好與地雷清楚可溝通",
  "landing.contact.title": "與我們聯絡",
  "landing.contact.hint": "之後可接後端或第三方表單；目前僅版型。",
  "landing.contact.namePh": "姓名",
  "landing.contact.msgPh": "訊息",
  "landing.contact.submit": "送出",
  "landing.contact.illus": "品牌視覺插圖",
  "landing.footer.blurb": "本機優先的靈感整理工具。",
  "landing.footer.copy": "© {year} Moodly",

  // —— value collage (gallery)
  "value.srOnly":
    "透過左側（窄螢幕為上方）四張小圖選取風格，右側顯示大圖與風格關鍵字；可使用鍵盤 Tab 切換縮圖按鈕。",
  "value.tablist": "風格縮圖",
  "value.kwAria": "{title} 風格關鍵字",
  "value.live": "選取的風格為「{title}」，關鍵字：",

  // —— article page
  "article.back": "← 延伸閱讀",
  "article.metaSuffix": "Moodly 裝潢溝通指南",

  "landing.nav.value": "能為你解決什麼",
  "landing.nav.how": "如何使用",
  "landing.nav.voices": "使用者回聲",

  "landing.hero.alt1": "現代簡約客廳空間，木質與植栽、柔和自然光",
  "landing.hero.alt2": "淺色沙發與木質茶几的客廳，抽象畫與吊燈",
  "landing.hero.alt3": "綠色模組沙發與極簡白牆的明亮起居空間",

  "landing.quote1":
    "原本跟設計師雞同鴨講，用了 Moodly 的 PDF 摘要後，對方馬上抓到我要的色調和風格，省下超多溝通時間！",
  "landing.quote1.name": "Emily，首購族",
  "landing.quote2":
    "我喜歡它的『避免項目』功能，我討厭深色木紋，標註後終於不用再看那些我不喜歡的設計了。",
  "landing.quote2.name": "Kevin，租屋改造者",
  "landing.quote3":
    "介面很乾淨，匯出的 PDF 很專業，直接存在手機裡去挑家具也很好用。",
  "landing.quote3.name": "Sarah，室內設計師客戶",

  "landing.how1.title": "建立空間需求",
  "landing.how1.body":
    "選擇居家類型，填寫生活習慣與避諱材質，定義出屬於你的空間個性。",
  "landing.how2.title": "匯入靈感碎片",
  "landing.how2.body":
    "上傳心動圖片或貼上網址，加入家具意向，讓抽象的想法具象化為視覺圖板。",
  "landing.how3.title": "匯出設計摘要",
  "landing.how3.body":
    "預覽自動排版後的 Moodboard，一鍵轉存 PDF，隨時隨地與設計師精準對頻。",

  "landing.g1.title": "靈感雜亂無章",
  "landing.g1.desc": "提供系統化標籤管理，讓你的素材從雜亂變井然。",
  "landing.g2.title": "設計需求難言傳",
  "landing.g2.desc": "透過結構化文字欄位，引導你精準描述對生活的期待。",
  "landing.g3.title": "溝通落差大",
  "landing.g3.desc": "PDF 設計摘要讓設計師精準掌握視覺偏好，降低來回修圖的風險。",
  "landing.g4.title": "圖片整合困難",
  "landing.g4.desc":
    "透過 API 代抓與 Base64 轉換，無論來源為何，都能整合為統一格式的圖板。",

  "landing.footer.p1": "產品",
  "landing.footer.p2": "資源",
  "landing.footer.p3": "法律",
  "landing.footer.f1": "功能一",
  "landing.footer.f2": "功能二",
  "landing.footer.f3": "定價",
  "landing.footer.r1": "說明文件",
  "landing.footer.r2": "部落格",
  "landing.footer.l1": "隱私權",
  "landing.footer.l2": "條款",

  // —— value slides (4)
  "value.s1.alt": "臥室主牆展示多幅畫作與柔和床品",
  "value.s1.title": "藝廊式臥房",
  "value.s1.k1": "床頭策展牆",
  "value.s1.k2": "畫框層次",
  "value.s1.k3": "暖白",
  "value.s2.alt": "現代客廳、綠植與編織燈飾",
  "value.s2.title": "植栽 × 現代客廳",
  "value.s2.k1": "低背沙發",
  "value.s2.k2": "藤編燈",
  "value.s2.k3": "中性底",
  "value.s3.alt": "中性色調起居空間與柔軟織品",
  "value.s3.title": "低彩度．慢生活",
  "value.s3.k1": "沙色",
  "value.s3.k2": "灰褐",
  "value.s3.k3": "織品",
  "value.s4.alt": "玄關鏡面與線條燈具",
  "value.s4.title": "鏡面．延伸玄關",
  "value.s4.k1": "鏡牆",
  "value.s4.k2": "線條燈",
  "value.s4.k3": "小坪數",
} as const;

export type MessageKey = keyof typeof STRINGS_ZH_TW;

export const STRINGS_EN: Record<MessageKey, string> = {
  "common.appName": "Moodly",
  "common.loading": "Loading saved data…",

  "lang.label": "Language",
  "lang.zh": "繁中",
  "lang.en": "English",

  "home.kicker": "Home inspiration · Design brief",
  "home.intro":
    "Create spaces, collect inspiration and tags, preview your moodboard, and export PDF.\nData stays in this browser only—clearing site data removes it.",
  "home.newSpace": "New space",
  "home.spaceType": "Space type",
  "home.displayName": "Display name (optional; defaults to type)",
  "home.namePlaceholder": "e.g. Entry + shoe bench nook",
  "home.createEdit": "Create & edit",
  "home.mySpaces": "My spaces",
  "home.emptyRooms": "No spaces yet—create one to start gathering ideas.",

  "room.notFound": "This space was not found. It may have been deleted.",
  "room.backHome": "Back to home",
  "room.backHomeAria": "Back to home",
  "room.breadcrumbHome": "Home",
  "room.nameLabel": "Space name",
  "room.delete": "Delete this space",
  "room.deleteConfirm":
    "Delete “{name}”? This cannot be undone.",
  "room.notesHeading": "Written brief",
  "room.notesHint":
    "Describe the mood, habits, and what you want from this space.",
  "room.notesPlaceholder":
    "e.g. Japandi, warm wood, calm, entry storage without clutter…",
  "room.styleTags": "Style / keyword tags",
  "room.styleTagsPh": "Type and press Enter or tap Add",
  "room.colorTags": "Color tags",
  "room.colorTagsPh": "e.g. off-white, light oak",
  "room.avoidHeading": "Avoid",
  "room.avoidPlaceholder":
    "e.g. high contrast, shiny metal, too much molding…",
  "room.unnamed": "Untitled space",

  "insp.title": "Inspiration images",
  "insp.subtitle":
    "Upload a file or paste an image URL (we fetch via the server for PDF-safe assets). Optional source label.",
  "insp.localUpload": "Upload file",
  "insp.imageUrl": "Image URL",
  "insp.fetching": "Fetching image…",
  "insp.addUrl": "Add from URL",
  "insp.sourceLabel": "Source label (optional; applies to new images)",
  "insp.sourcePlaceholder": "e.g. Pinterest, brand site",
  "insp.empty": "No images yet—upload or add a URL.",
  "insp.remove": "Remove",
  "err.pickFile": "Please choose an image file",
  "err.fileTooLarge": "Each file must be under {mb} MB",
  "err.readFail": "Could not read the image",
  "err.invalidUrl": "Enter a valid http(s) image URL",
  "err.httpOnly": "Only http / https URLs",
  "err.downloadFail": "Could not download the image",
  "err.serverOdd": "Unexpected server response—try again later",
  "err.offline": "Could not connect—check your network or dev server",

  "fur.title": "Furniture / pieces you want",
  "fur.subtitle":
    "Add pieces you plan to place: name plus an image (file or URL); brand optional. Moodboard & PDF show images for visual discussion.",
  "fur.useUrl": "Use image URL",
  "fur.itemName": "Item name",
  "fur.itemPlaceholder": "e.g. dining chair",
  "fur.brand": "Brand (optional)",
  "fur.brandPlaceholder": "e.g. IKEA, Muuto",
  "fur.previewHint": "Preview—confirm, then Add to list",
  "fur.clearImage": "Clear image",
  "fur.addToList": "Add to list",
  "fur.empty": "No furniture items yet.",
  "fur.noBrand": "No brand",
  "fur.needName": "Please enter a furniture name",
  "fur.needImage": "Add an image (upload or URL) before saving",

  "mb.briefLine": "Moodly · Design Brief",
  "mb.notes": "Written brief",
  "mb.styleTags": "Style / keywords",
  "mb.colorTags": "Color tags",
  "mb.avoid": "Avoid",
  "mb.dash": "—",
  "mb.inspirationTitle": "INSPIRATION IMAGES",
  "mb.noImages": "No images yet",
  "mb.moreImages":
    "{count} more image(s) not shown (max {max} per page)",
  "mb.moreFurniture":
    "{count} more furniture image(s) not shown (max {max} per page)",
  "mb.paletteTitle": "COLOR PALETTE",
  "mb.paletteHint": "Five colors sampled from inspiration images",
  "mb.noPalette": "No images—palette unavailable",
  "mb.paletteLoading": "Analyzing colors…",
  "mb.paletteFail": "Could not extract a palette (loading limits may apply)",
  "mb.footerEn": "Design summary — for discussion purposes only.",
  "mb.footerZh": "Design summary · for discussion.",
  "mb.sectionTitle": "Moodboard preview (PDF exports this block)",

  "pdf.export": "Export PDF",
  "pdf.exporting": "Generating PDF…",
  "pdf.exportFail":
    "Export failed. Refresh and try again, or use fewer images.",
  "pdf.noBlock": "Export block not found",
  "pdf.allRooms": "Export all spaces PDF",
  "pdf.allEmpty": "Nothing to export—refresh and try again.",
  "pdf.allFail": "Batch export failed—try again or reduce images.",

  "tag.add": "Add",
  "tag.removeAria": "Remove {name}",

  "sort.drag": "Drag to reorder: {name}",
  "sort.imagesMeta": "{count} images · {date}",
  "sort.edit": "Edit →",
  "sort.moveUp": "Move “{name}” up",
  "sort.moveDown": "Move “{name}” down",
  "sort.deleteConfirm":
    "Delete “{name}”? All inspiration and settings for this space will be removed from this device.",
  "sort.delete": "Delete",
  "sort.deleteAria": "Delete space: {name}",

  "landing.nav.open": "Open menu",
  "landing.nav.close": "Close menu",
  "landing.nav.main": "Primary navigation",
  "landing.cta.start": "Get started",
  "landing.hero.badge": "Home inspiration · Design brief",
  "landing.hero.title": "Turn scattered decor ideas into a clear moodboard.",
  "landing.hero.sub":
    "From messy saves to a precise design brief—Moodly helps you explain the home you imagine.",
  "landing.hero.ctaPrimary": "Get started",
  "landing.hero.ctaSecondary": "What we solve",
  "landing.hero.carousel": "Hero visuals",
  "landing.hero.prev": "← Previous",
  "landing.hero.prevAria": "Previous slide",
  "landing.hero.next": "Next →",
  "landing.hero.nextAria": "Next slide",
  "landing.trust": "Partners",
  "landing.value.title":
    "Turn messy inspiration into language designers understand quickly.",
  "landing.value.p1":
    "Pain & fit: saved endless Pinterest shots but can’t name what you love? Afraid briefs get lost in translation? Moodly structures screenshots and keywords into a professional design summary so conversations stay efficient.",
  "landing.value.p2":
    "When it helps: renovating, a new home, or a light rental refresh—before you talk to a pro, map your home vision with Moodly so every dollar speaks to what matters to you.",
  "landing.how.title": "How to use Moodly",
  "landing.how.sub":
    "Three simple steps to your interior communication kit.",
  "landing.how.stepLabel": "Step {step}: ",
  "landing.how.more": "Learn more →",
  "landing.voices.title": "Where over 500 renovation journeys start",
  "landing.voices.prev": "Previous",
  "landing.voices.next": "Next",
  "landing.grid.title": "Four friction points—from saves to alignment",
  "landing.grid.sub":
    "How Moodly maps to these moments and helps you decide with clarity.",
  "landing.grid.cta": "See →",
  "landing.guide.kicker": "Moodly renovation communication guide",
  "landing.guide.title": "Further reading",
  "landing.guide.tip":
    "Tip: use JPG/PNG for uploads, and export a PDF backup early once your first pass is in place.",
  "landing.guide.read": "Read article →",
  "landing.guide.readAria": "Read: {title}",
  "landing.cta2.title": "Ready to organize your ideas?",
  "landing.cta2.body":
    "No sign-up—create your first space in the browser and start shaping your home.",
  "landing.cta2.btn": "Try it now",
  "landing.cta2.before": "Scattered inspiration, no clear start",
  "landing.cta2.after": "One-page direction for your space",
  "landing.cta3.title": "About Moodly",
  "landing.cta3.body":
    "Everyone deserves a home that fits—clarity starts with knowing what you want.",
  "landing.cta3.btn": "Our approach",
  "landing.cta3.titleAttr": "Learn more",
  "landing.cta3.before": "Likes and dislikes are mixed up",
  "landing.cta3.after": "Preferences and no-go items are clear",
  "landing.contact.title": "Contact us",
  "landing.contact.hint": "Wire to a backend later—layout only for now.",
  "landing.contact.namePh": "Name",
  "landing.contact.msgPh": "Message",
  "landing.contact.submit": "Send",
  "landing.contact.illus": "Brand illustration",
  "landing.footer.blurb": "Local-first inspiration workspace.",
  "landing.footer.copy": "© {year} Moodly",

  "value.srOnly":
    "Pick a style from four thumbnails on the left (top on narrow screens); the main image and keywords update on the right. Use Tab to move between thumbnails.",
  "value.tablist": "Style thumbnails",
  "value.kwAria": "Keywords for {title}",
  "value.live": "Selected style “{title}”, keywords:",

  "article.back": "← Further reading",
  "article.metaSuffix": "Moodly guide",

  "landing.nav.value": "What we solve",
  "landing.nav.how": "How it works",
  "landing.nav.voices": "Voices",

  "landing.hero.alt1":
    "Modern minimalist living room with wood, plants, and soft daylight",
  "landing.hero.alt2":
    "Light sofa and wood coffee table, abstract art and pendant lamp",
  "landing.hero.alt3":
    "Green modular sofa and bright minimalist living space",

  "landing.quote1":
    "We used to talk past each other—with Moodly’s PDF brief, my designer finally matched the palette and mood. Huge time saved.",
  "landing.quote1.name": "Emily, first-time buyer",
  "landing.quote2":
    "I love “Avoid”—I hate dark wood grain; labeling it finally stopped those directions I don’t want.",
  "landing.quote2.name": "Kevin, renter refresh",
  "landing.quote3":
    "Clean UI; PDFs feel professional—I keep them on my phone when shopping for furniture.",
  "landing.quote3.name": "Sarah, design client",

  "landing.how1.title": "Define your space",
  "landing.how1.body":
    "Pick the space type, habits, and materials to steer clear of—shape your room’s personality.",
  "landing.how2.title": "Gather inspiration",
  "landing.how2.body":
    "Upload shots or paste URLs, add furniture intentions—turn fuzzy ideas into a visual board.",
  "landing.how3.title": "Export your brief",
  "landing.how3.body":
    "Preview the laid-out moodboard and save PDF—stay aligned with your designer anywhere.",

  "landing.g1.title": "Scattered inspiration",
  "landing.g1.desc": "Tagging and structure so references stop living in chaos.",
  "landing.g2.title": "Hard to describe taste",
  "landing.g2.desc": "Guided text fields to articulate how you want to live.",
  "landing.g3.title": "Design misalignment",
  "landing.g3.desc": "A PDF brief so pros read your visual language with less back-and-forth.",
  "landing.g4.title": "Images from everywhere",
  "landing.g4.desc": "Server fetch and encoding so sources converge on one board format.",

  "landing.footer.p1": "Product",
  "landing.footer.p2": "Resources",
  "landing.footer.p3": "Legal",
  "landing.footer.f1": "Feature A",
  "landing.footer.f2": "Feature B",
  "landing.footer.f3": "Pricing",
  "landing.footer.r1": "Docs",
  "landing.footer.r2": "Blog",
  "landing.footer.l1": "Privacy",
  "landing.footer.l2": "Terms",

  "value.s1.alt": "Bedroom gallery wall with art and soft bedding",
  "value.s1.title": "Gallery bedroom",
  "value.s1.k1": "Curated headboard wall",
  "value.s1.k2": "Layered frames",
  "value.s1.k3": "Warm white",
  "value.s2.alt": "Modern living room with plants and woven lighting",
  "value.s2.title": "Plants × modern living",
  "value.s2.k1": "Low-back sofa",
  "value.s2.k2": "Woven pendant",
  "value.s2.k3": "Neutral base",
  "value.s3.alt": "Neutral lounge with soft textiles",
  "value.s3.title": "Low chroma, slow living",
  "value.s3.k1": "Sand",
  "value.s3.k2": "Greige",
  "value.s3.k3": "Textiles",
  "value.s4.alt": "Entry mirror wall with linear lighting",
  "value.s4.title": "Mirror · stretched entry",
  "value.s4.k1": "Mirror wall",
  "value.s4.k2": "Linear lights",
  "value.s4.k3": "Compact plan",
};

export function pickStrings(locale: AppLocale) {
  return locale === "en" ? STRINGS_EN : STRINGS_ZH_TW;
}
