import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { PersistGate } from "@/components/PersistGate";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "裝潢需求翻譯器 · Interior Mood Translator",
  description:
    "把模糊的裝潢想法整理成結構化需求、moodboard 與可分享的設計摘要（MVP）。",
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
      className={`${geistMono.variable} h-full bg-app text-ink antialiased`}
    >
      <body className="flex min-h-full flex-col bg-app text-ink antialiased">
        <PersistGate>{children}</PersistGate>
      </body>
    </html>
  );
}
