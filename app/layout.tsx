import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智能取餐看板",
  description: "餐廳取餐紀錄系統",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body>{children}</body>
    </html>
  );
}
