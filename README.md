# 裝潢需求翻譯器（Interior Mood Translator）

協助一般使用者把模糊的裝潢靈感整理成 **結構化文字需求**、**視覺 moodboard**，並可匯出 **PDF 設計摘要**，方便與室內設計師溝通。

目前為 **第一版（MVP）**：純前端、資料存於瀏覽器本機，**無後端伺服器**。

---

## 功能一覽（MVP）

| 功能               | 說明                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| **空間管理**       | 依類型（玄關、客廳、主臥等）建立多個空間，各自獨立編輯與刪除            |
| **文字需求**       | 自由描述風格、感覺、生活習慣與對空間的期待                              |
| **避免項目**       | 記錄不希望出現的材質或視覺元素                                          |
| **手動標籤**       | 風格／關鍵字、色系：提供快捷建議，亦可自訂標籤                          |
| **靈感圖片**       | 本機上傳（多張、單張有大小上限）或貼上 **http(s)** 圖片網址；可標記來源 |
| **Moodboard 預覽** | 同頁顯示設計摘要、色系示意、最多 12 張拼貼                              |
| **匯出 PDF**       | 將預覽區截圖輸出為 A4 PDF（供列印或傳給設計師）                         |

**本版刻意不包含：** AI 圖片分析、自動風格辨識、雲端帳號、線上分享連結（見下方「後續規劃」與 PRD）。

---

## 技術棧

- **框架：** [Next.js](https://nextjs.org/) 16（App Router）
- **語言：** TypeScript
- **樣式：** Tailwind CSS v4
- **狀態與持久化：** [Zustand](https://github.com/pmndrs/zustand) + `localStorage`
- **PDF／畫面擷取：** [jsPDF](https://github.com/parallax/jsPDF)、[html2canvas](https://github.com/niklasvh/html2canvas)
- **ID 生成：** [nanoid](https://github.com/ai/nanoid)

---

## 目錄結構（精簡）

```text
interior_mood_translator/
├── README.md                 # 本說明
├── color.md                  # 品牌／介面色票與使用建議
├── 🏠 … PRD.md               # 產品需求文件（PRD）
├── web/                      # Next.js 應用程式
│   ├── app/                  # 路由與版面（layout、首頁、空間編輯頁）
│   ├── components/         # UI 元件（標籤編輯、圖片區、moodboard、PDF 等）
│   ├── lib/                  # 型別、常數、Zustand store
│   ├── public/
│   └── package.json
└── .gitignore
```

---

## 環境需求

- **Node.js**：建議 **20.x 或以上**（與 Next.js 16 相容；若使用 nvm／fnm，請先切到相符版本）
- **套件管理：** npm（專案內含 `package-lock.json`）

---

## 安裝與執行

### 1. 安裝依賴

```bash
cd web
npm install
```

### 2. 開發模式（本機預設 http://localhost:3000）

```bash
npm run dev
```

### 3. 正式建置與啟動

```bash
npm run build
npm start
```

### 4. Lint

```bash
npm run lint
```

---

## 使用流程（給使用者）

1. 開啟首頁 → 選擇空間類型、可自訂名稱 → **建立並編輯**。
2. 在空間頁填寫 **文字需求**、**避免項目**，並用標籤整理 **風格／色系**。
3. 上傳靈感圖或貼上圖片 URL（必要時填 **來源標記**）。
4. 捲動至 **Moodboard 預覽** 確認版面。
5. 點 **匯出 PDF** 下載檔案。

---

## 資料儲存與隱私

- 所有空間、圖片（以 Data URL 或 URL 字串）、文字與標籤皆存在瀏覽器 **`localStorage`**（鍵名：`interior-mood-translator-rooms`）。
- **沒有**將資料上傳至任何伺服器；清除網站資料或換瀏覽器／裝置後，資料**不會**同步還原。
- 若需要跨裝置或備份，請自行下載 PDF 或於後續版本導入雲端方案。

---

## 匯出 PDF 注意事項

- 匯出會對 **Moodboard 預覽區** 做螢幕截圖後寫入 PDF。
- 若圖片來自**外部網址**，部分網站因 **CORS** 或跨網域限制，擷圖可能失敗或留白；**建議重要圖片改為本機上傳**。

---

## 介面與品牌色

視覺規範（主色 Cream、輔色 Peach、平衡綠 Sage、重點 Honey Gold 等）整理於根目錄 **[color.md](./color.md)**，與實作時使用的 CSS／Tailwind 語意色一致。

---

## 後續規劃（見 PRD）

產品較完整的路線圖、第二階段 AI（風格分類、圖片分析、需求衝突檢測），以及可選的 **Supabase** 後端、分享連結等，請見 **[PRD](./🏠%20裝潢需求翻譯器（Interior%20Mood%20Translator）PRD.md)**（若檔名含 emoji 導致連結異常，請在檔案總管直接開啟該檔）。

---

## 疑難排解

| 狀況                   | 建議                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------- |
| 頁面顯示異常或樣式錯誤 | 確認使用 `npm run dev` 或已成功 `npm run build`；強制重新整理瀏覽器（Cmd+Shift+R） |
| 資料不見               | 是否清除過網站資料／換瀏覽器；本版僅本機儲存                                       |
| PDF 空白或失敗         | 改用上傳圖片；關閉阻擋擷圖的瀏覽器擴充套件後再試                                   |

---

## 授權

未指定授權條款前，預設為版權所有；若要開源請自行補上 `LICENSE`。
