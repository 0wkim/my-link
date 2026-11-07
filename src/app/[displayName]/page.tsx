import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { findUserByDisplayNameOrUsername } from "@/lib/firestore-profile";
import { getLinksFromFirestore } from "@/lib/firestore-links";
import { PublicProfileView } from "@/components/profile/public-profile-view";
import { getInitialSeedDatabase } from "@/store/profile-store";
import type { UserProfileData, LinkItem } from "@/types/link";

interface PageProps {
  params: Promise<{ displayName: string }>;
}

async function DisplayNamePageContent({ params }: PageProps) {
  // Next.js 16 Partial Prerendering: opt-out of static prerendering for dynamic DB calls
  await connection();

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

  // Server Component -> Client Component 전달을 위한 순수 Plain Object 보장
  const plainProfile: UserProfileData = {
    uid: String(userProfile.uid),
    username: String(userProfile.username),
    displayName: String(userProfile.displayName),
    bio: String(userProfile.bio || ""),
    avatarUrl: userProfile.avatarUrl ? String(userProfile.avatarUrl) : undefined,
    role: userProfile.role ? String(userProfile.role) : undefined,
    email: userProfile.email ? String(userProfile.email) : undefined,
    createdAt: userProfile.createdAt ? String(userProfile.createdAt) : undefined,
    updatedAt: userProfile.updatedAt ? String(userProfile.updatedAt) : undefined,
  };

  const plainLinks: LinkItem[] = links.map((link) => ({
    id: String(link.id),
    userHandle: String(link.userHandle || "user"),
    title: String(link.title || ""),
    subtitle: link.subtitle ? String(link.subtitle) : undefined,
    url: String(link.url || ""),
    category: link.category || "portfolio",
    iconType: link.iconType || "globe",
    iconBg: link.iconBg ? String(link.iconBg) : undefined,
    iconColor: link.iconColor ? String(link.iconColor) : undefined,
    badge: link.badge ? String(link.badge) : undefined,
    isActive: Boolean(link.isActive),
    isPinned: Boolean(link.isPinned),
    displayOrder: Number(link.displayOrder || 0),
    clickCount: Number(link.clickCount || 0),
    createdAt: String(link.createdAt || ""),
    updatedAt: String(link.updatedAt || ""),
  }));

  // 3. 화면에 프로필 정보와 링크 리스트 표시
  return <PublicProfileView profile={plainProfile} links={plainLinks} />;
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
