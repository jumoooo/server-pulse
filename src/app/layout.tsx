import type { Metadata } from "next";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServerPulse — Game Server Observability",
  description: "AI-powered game server observability platform",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * suppressHydrationWarning: next-themes가 서버/클라이언트 간
     * class 속성 불일치를 발생시킬 수 있으므로 경고 억제
     */
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-bg-base text-fg-base">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
