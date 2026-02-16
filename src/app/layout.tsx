import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "(주)에스앤피이 | SNPE.Inc - Total Engineering Solution",
  description: "공정 설계부터 시스템 통합까지, Total Engineering Solution SNPE. 공장자동화, 프로세스 엔지니어링, 프로그램 개발, CCTV 시스템 전문.",
  keywords: ["에스앤피이", "SNPE", "공장자동화", "스마트팩토리", "프로세스 엔지니어링", "엔지니어링 솔루션"],
};

import DataStream from "@/components/ui/DataStream";
import ParticleNetwork from "@/components/ui/ParticleNetwork";
import AIConcierge from "@/components/ui/AIConcierge";
import CommandPalette from "@/components/ui/CommandPalette";
import Minimap from "@/components/ui/Minimap";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} font-sans antialiased bg-slate-950 text-slate-100`}>
        <ParticleNetwork />
        <DataStream />
        <AIConcierge />
        <CommandPalette />
        <Minimap />
        {children}
      </body>
    </html>
  );
}
