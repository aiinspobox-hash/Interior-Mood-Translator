import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display } from "next/font/google";
import { PersistGate } from "@/components/PersistGate";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const moodlyDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
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
      className={`${geistMono.variable} ${moodlyDisplay.variable} h-full bg-app text-ink antialiased`}
    >
      <body className="flex min-h-full flex-col bg-app text-ink antialiased">
        <PersistGate>{children}</PersistGate>
      </body>
    </html>
  );
}
