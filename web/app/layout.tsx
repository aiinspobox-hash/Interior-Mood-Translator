import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono, Playfair_Display } from "next/font/google";
import { PersistGate } from "@/components/PersistGate";
import { I18nProvider } from "@/contexts/I18nContext";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** 內文：清楚、略帶幾何感，偏 approachable sophistication */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

/** 標題：保留襯線的精緻感，與 DM Sans 並用 */
const moodlyDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moodly · 居家靈感與設計摘要",
  description:
    "建立空間、整理文字需求與標籤、收集靈感圖與家具意向，預覽 moodboard 並匯出 PDF 設計摘要。",
};

/** 避免系統深色模式讓瀏覽器預設底色呈現為深色 */
export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistMono.variable} ${dmSans.variable} ${moodlyDisplay.variable} h-full bg-app text-ink antialiased`}
    >
      <body className="font-sans flex min-h-full flex-col bg-app text-ink antialiased">
        <I18nProvider>
          <PersistGate>{children}</PersistGate>
        </I18nProvider>
      </body>
    </html>
  );
}
