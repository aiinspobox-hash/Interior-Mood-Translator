# 裝潢需求翻譯器（Interior Mood Translator）PRD

## 1. 產品名稱

**裝潢需求翻譯器（Interior Mood Translator）**

---

## 2. 產品目標

### 2.1 核心價值

讓一般使用者把「模糊的裝潢想法」轉換為：

1. **結構化設計需求**
2. **視覺化 moodboard**
3. **可與室內設計師溝通的提案文件**

### 2.2 要解決的問題

- 使用者講不清楚自己想要什麼
- 設計師只收到零碎圖片與描述
- 溝通成本高、來回修改多

---

## 3. 核心概念

### 3.1 輸入（User Input）

使用者需提供：

| 類型 | 說明 |
|------|------|
| **空間類型** | 玄關、客廳、主臥、書房等 |
| **圖片** | 靈感來源 |
| **文字描述** | 風格、感覺、喜好 |

**文字範例：** Japandi、溫暖、木質、乾淨、有收納感

### 3.2 輸出（System Output）

系統轉換為三種結果，順序如下：

#### （1）結構化設計需求

- **風格分類**：Japandi、北歐、無印等
- **色系**：米白、淺木、灰等
- **材質**：木頭、布料、石材等
- **空間需求**：收納、採光、動線等

#### （2）Moodboard（視覺化板）

自動生成一張拼貼圖，包含：

- 6–12 張風格圖片
- Color palette（色票）
- 材質 reference
- 關鍵字標籤

**用途：** 可直接拿給設計師溝通。

#### （3）設計摘要（Design Brief）

可輸出 **PDF** 或 **分享頁面**，內容示例：

- **空間：** 玄關  
- **風格：** Japandi  
- **關鍵元素：** 木質元素、低飽和色系、隱藏式收納  
- **避免項目：** 高對比顏色、金屬亮面材質  

---

## 4. 功能模組設計

### 4.1 空間管理（Room System）

**流程：**

1. 使用者可建立多個空間（玄關、客廳、廚房、主臥、書房等）
2. 每個空間維護獨立資料

**資料結構：**

```text
Room {
  id: string
  name: string
  images: Image[]
  notes: string[]
  style_tags: string[]
}
```

### 4.2 靈感圖片收集

**目前功能：**

- 上傳圖片
- 或貼 URL
- 可標記來源

**未來可升級：**

- AI 自動分析圖片風格

### 4.3 文字需求輸入（NLP Parsing）

**使用者輸入：** 自由文字

**系統需完成：**

1. 風格辨識  
2. 情緒分類（溫暖 / 冷淡 / 高級 / 生活感）  
3. 關鍵元素抽取  

**輸出結構示例：**

```text
ParsedIntent {
  style: "Japandi",
  mood: "warm",
  materials: ["wood", "linen"],
  constraints: ["lots of storage", "minimal clutter"]
}
```

### 4.4 Moodboard Generator（核心功能）

| 方向 | 內容 |
|------|------|
| **輸入** | 圖片 + tags + style |
| **輸出** | 一張設計拼貼圖（image generation） |

**資料結構：**

```text
Moodboard {
  title: string,
  images: string[],
  color_palette: string[],
  materials: string[],
  keywords: string[]
}
```

### 4.5 設計提案輸出（Export）

**格式：**

- PDF
- Shareable link

**內容包含：**

- moodboard
- 結構化需求
- 設計建議

---

## 5. AI 功能（第二階段）

### 5.1 風格分類模型

支援例如：Japandi、Nordic、Industrial、Modern 等。

### 5.2 圖片分析（Vision Model）

輸出：

- 主色
- 材質
- 風格

### 5.3 需求矛盾檢測

**情境示例：** 我要極簡 + 很多收納 + 不想看到櫃子  

**系統行為：**

- 提示需求衝突
- 建議例如：隱藏式收納

---

## 6. 功能範圍建議

### 6.1 必做

1. 空間分類  
2. 圖片上傳  
3. 文字輸入  
4. 手動標籤（風格 / 顏色）  
5. moodboard（手動拼貼或 template）  
6. PDF 輸出  

### 6.2 暫時不做

- AI 圖片分析
- 自動生成設計建議
- 複雜推薦系統

---

## 7. 建議技術架構（Cursor 可直接採用）

### 7.1 Frontend

- Next.js  
- Tailwind CSS  
- React Flow（可選，用於空間管理）  

### 7.2 Backend

**Supabase（推薦）：**

- auth  
- storage（圖片）  
- database  

### 7.3 AI（後期）

- OpenAI Vision API  
- embeddings（風格分類）  

---

## 8. 成功指標（KPI）

- 使用者平均建立 **≥ 2** 個空間  
- 每個空間 **≥ 5** 張靈感圖  
- moodboard 生成後的分享率  
- 設計師使用率（B2B 延伸）  

---

## 9. 產品願景（長期）

**演進路徑：**

1. **現階段：** 靈感整理工具  
2. **中期：** AI 室內設計溝通助理  
3. **長期延伸：**  
   - 自動平面配置建議  
   - 預算估算  
   - 家具推薦  
