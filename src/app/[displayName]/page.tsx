import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findUserByDisplayNameOrUsername } from "@/lib/firestore-profile";
import { getLinksFromFirestore } from "@/lib/firestore-links";
import { PublicProfileView } from "@/components/profile/public-profile-view";
import { getInitialSeedDatabase } from "@/store/profile-store";
import type { UserProfileData } from "@/types/link";

interface PageProps {
  params: Promise<{ displayName: string }>;
}

export function generateStaticParams() {
  return [
    { displayName: "hong" },
    { displayName: "홍길동" },
  ];
}

async function DisplayNamePageContent({ params }: PageProps) {
  const { displayName } = await params;
  const cleanParam = decodeURIComponent(displayName).replace(/^@/, "").trim();

  if (!cleanParam) {
    notFound();
  }

  // 1. displayName으로 유저 검색 (또는 username으로 유저 검색)
  let userProfile: UserProfileData | null = await findUserByDisplayNameOrUsername(cleanParam);

  // Firestore에 아직 유저가 없고 기본 'hong' 또는 '홍길동'을 조회한 경우 시드 데이터 폴백 제공
  if (!userProfile) {
    const isHong = cleanParam.toLowerCase() === "hong" || cleanParam === "홍길동";
    if (isHong) {
      const seedHong = getInitialSeedDatabase().hong;
      userProfile = {
        uid: "hong",
        username: seedHong.profile.handle,
        displayName: seedHong.profile.displayName,
        bio: seedHong.profile.bio,
        avatarUrl: seedHong.profile.avatarUrl,
        role: seedHong.profile.role,
        email: seedHong.profile.email,
      };
    }
  }

  // 4. username/displayName을 찾지 못하면 404 페이지 표시
  if (!userProfile) {
    notFound();
  }

  // 2. 링크 조회: users/{userId}/links
  let links = await getLinksFromFirestore(userProfile.uid);

  // hong 시드 폴백 링크 처리 (Firestore에 데이터가 없을 때)
  if (links.length === 0 && userProfile.uid === "hong") {
    const seedHong = getInitialSeedDatabase().hong;
    links = seedHong.links || [];
  }

  // 3. 화면에 프로필 정보와 링크 리스트 표시
  return <PublicProfileView profile={userProfile} links={links} />;
}

export default function DisplayNamePage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-3 border-[#3182F6] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DisplayNamePageContent {...props} />
    </Suspense>
  );
}
