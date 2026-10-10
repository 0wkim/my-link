import { Suspense } from "react";
import ProfilePage from "@/components/profile-page";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export function generateStaticParams() {
  return [
    { handle: "hong" },
    { handle: "@hong" },
    { handle: "sujin" },
    { handle: "@sujin" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const cleanHandle = decodeURIComponent(handle).replace(/^@/, "");

  return {
    title: `@${cleanHandle}님의 마이링크 | MyLink`,
    description: `@${cleanHandle}님의 프로필 및 전체 링크 목록을 확인해 보세요.`,
  };
}

async function HandleProfileContent({ params }: PageProps) {
  const { handle } = await params;
  const cleanHandle = decodeURIComponent(handle).replace(/^@/, "");

  return <ProfilePage initialHandle={cleanHandle} />;
}

export default function UserHandlePage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
          <span className="text-sm font-medium text-[#6B7684]">프로필을 불러오는 중이에요...</span>
        </div>
      }
    >
      <HandleProfileContent {...props} />
    </Suspense>
  );
}
