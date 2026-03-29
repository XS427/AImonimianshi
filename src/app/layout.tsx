import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI模拟面试助手 - 智能面试训练平台",
  description: "专业的AI模拟面试平台，支持多种行业HR面试官，提供真实面试体验和深度追问。",
  keywords: ["模拟面试", "AI面试", "HR面试", "求职", "面试训练", "职业发展"],
  authors: [{ name: "AI Interview Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AI模拟面试助手",
    description: "专业的AI模拟面试平台，提供真实面试体验",
    url: "https://chat.z.ai",
    siteName: "AI面试助手",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI模拟面试助手",
    description: "专业的AI模拟面试平台，提供真实面试体验",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
