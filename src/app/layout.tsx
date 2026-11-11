import type { Metadata } from "next";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MYLINK | 나만의 링크 모바일 허브",
  description:
    "나만의 링크를 한곳에서 간편하게 공유하고 관리하는 올인원 링크인바이오 서비스",
  metadataBase: new URL("https://my-link-wine-tau.vercel.app"),
  openGraph: {
    title: "MYLINK | 나만의 링크 모바일 허브",
    description: "나만의 링크를 한곳에서 간편하게 공유하고 관리하세요.",
    siteName: "MYLINK",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
