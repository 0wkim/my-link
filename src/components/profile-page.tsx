"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useProfileStore } from "@/store/profile-store";
import type { LinkItem, LinkCategory, LinkCreateInput, LinkUpdateInput, UserProfile } from "@/types/link";
import { ProfileActions } from "@/components/profile/profile-actions";
import { ProfileHeader } from "@/components/profile/profile-header";
import { CategoryFilter } from "@/components/links/category-filter";
import { LinkList } from "@/components/links/link-list";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import { IntroDialog } from "@/components/profile/intro-dialog";
import { IconCheck, IconGoogle } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfilePageProps {
  initialHandle?: string;
}

export default function ProfilePage({ initialHandle = "hong" }: ProfilePageProps) {
  const normalizedInitial = initialHandle.replace(/^@/, "");

  // Firebase Auth 유저 상태
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Zustand 스토어 상태 및 액션
  const profiles = useProfileStore((s) => s.profiles);
  const currentHandle = useProfileStore((s) => s.currentHandle);
  const addLink = useProfileStore((s) => s.addLink);
  const updateLink = useProfileStore((s) => s.updateLink);
  const deleteLink = useProfileStore((s) => s.deleteLink);
  const syncFirestoreLinks = useProfileStore((s) => s.syncFirestoreLinks);
  const trackClick = useProfileStore((s) => s.trackClick);
  const trackView = useProfileStore((s) => s.trackView);

  // 로컬 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LinkCategory | "all">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  // Firestore 조회/갱신 중 로딩 상태 (최초 로드 시 true)
  const [isLinksLoading, setIsLinksLoading] = useState(true);

  // onAuthStateChanged 리스너 등록
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 활성 엔트리 (hong 고정)
  const activeHandle = "hong";

  // Google 로그인 핸들러
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const name = result.user.displayName || result.user.email?.split("@")[0] || "회원";
      showToast(`${name}님 환영합니다!`);
    } catch (error: any) {
      console.error("Google 로그인 실패:", error);
      if (error?.code !== "auth/popup-closed-by-user") {
        showToast("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      showToast("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 새 링크 추가 핸들러 (Firestore 경로: users/{user.uid}/links에 저장)
  const handleAddLink = async (input: LinkCreateInput) => {
    try {
      const targetUserId = currentUser ? currentUser.uid : "anonymous";
      const newLink = await addLink(activeHandle, input, targetUserId);
      // 검색어나 카테고리 필터가 걸려 있으면 방금 추가한 링크가 안 보일 수 있으므로 초기화
      if (
        searchQuery.trim() ||
        (selectedCategory !== "all" && selectedCategory !== input.category)
      ) {
        setSearchQuery("");
        setSelectedCategory("all");
      }
      showToast(`'${newLink.title}' 링크를 추가했어요`);
      // Firestore에서 최신 목록 재조회 (createdAt 최신순 반영)
      setIsLinksLoading(true);
      await syncFirestoreLinks(activeHandle, targetUserId);
    } catch (error) {
      console.error("링크 추가 중 오류 발생:", error);
      showToast("링크 추가 중 오류가 발생했습니다.");
    } finally {
      setIsLinksLoading(false);
    }
  };

  // 링크 수정 핸들러 (Firestore 업데이트 및 최신 목록 갱신)
  const handleUpdateLink = async (linkId: string, input: LinkUpdateInput) => {
    try {
      const targetUserId = currentUser ? currentUser.uid : "anonymous";
      await updateLink(activeHandle, linkId, input, targetUserId);
      showToast("링크를 수정했어요");
      // Firestore에서 최신 데이터 재조회하여 갱신
      await syncFirestoreLinks(activeHandle, targetUserId);
    } catch (error) {
      console.error("링크 수정 중 오류 발생:", error);
      showToast("링크 수정 중 오류가 발생했습니다.");
    }
  };

  // 링크 삭제 핸들러 (Firestore 삭제 및 최신 목록 갱신)
  const handleDeleteLink = async (linkId: string) => {
    try {
      const targetUserId = currentUser ? currentUser.uid : "anonymous";
      await deleteLink(activeHandle, linkId, targetUserId);
      showToast("링크를 삭제했어요");
      // Firestore에서 최신 데이터 재조회하여 갱신
      await syncFirestoreLinks(activeHandle, targetUserId);
    } catch (error) {
      console.error("링크 삭제 중 오류 발생:", error);
      showToast("링크 삭제 중 오류가 발생했습니다.");
    }
  };

  // 유저 또는 마운트 시 Firestore 링크 동기화
  useEffect(() => {
    trackView(activeHandle);
    if (isAuthLoading) return;

    if (!currentUser) {
      setIsLinksLoading(false);
      return;
    }

    setIsLinksLoading(true);
    // 로그인된 유저 uid 기준으로 users/{user.uid}/links 조회
    syncFirestoreLinks(activeHandle, currentUser.uid).finally(() => {
      setIsLinksLoading(false);
    });
  }, [currentUser, isAuthLoading, activeHandle, trackView, syncFirestoreLinks]);

  const userEntry = profiles[activeHandle] || profiles.hong;
  const rawLinks = userEntry?.links;

  // 로그인 상태에 따른 프로필 데이터 동적 구성 (로그인 유저 정보 화면 반영)
  const profile: UserProfile = useMemo(() => {
    const baseProfile = userEntry?.profile || {
      handle: "user",
      displayName: "사용자",
      bio: "마이링크에 오신 것을 환영해요.",
      viewsCount: 0,
    };

    if (currentUser) {
      const displayName =
        currentUser.displayName || currentUser.email?.split("@")[0] || baseProfile.displayName;
      const email = currentUser.email || baseProfile.email;
      const avatarUrl = currentUser.photoURL || baseProfile.avatarUrl;
      const handle = currentUser.email ? currentUser.email.split("@")[0] : baseProfile.handle;

      return {
        ...baseProfile,
        displayName,
        email,
        avatarUrl,
        handle,
        role: "마이링크 멤버",
        bio: `${displayName}님의 개인 맞춤형 마이링크 공간이에요.`,
      };
    }

    return baseProfile;
  }, [userEntry, currentUser]);

  // 로딩 중이거나 미로그인 시 링크 목록 처리
  const links = useMemo(() => {
    if (!currentUser || isLinksLoading) return [];
    return rawLinks || [];
  }, [rawLinks, isLinksLoading, currentUser]);

  // 토스트 메시지 표시
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // 활성화된 링크 목록 필터링 및 정렬
  const activeLinks = useMemo(() => {
    return links
      .filter((link) => link.isActive)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        // createdAt 최신순 (내림차순)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [links]);

  // 사용 가능한 카테고리 목록 및 카운트
  const { availableCategories, categoryCounts } = useMemo(() => {
    const cats = new Set<LinkCategory>();
    const counts: Record<string, number> = {};
    activeLinks.forEach((link) => {
      if (link.category) {
        cats.add(link.category);
        counts[link.category] = (counts[link.category] || 0) + 1;
      }
    });
    return {
      availableCategories: Array.from(cats),
      categoryCounts: counts,
    };
  }, [activeLinks]);

  // 검색 및 카테고리 필터링된 링크 목록
  const filteredLinks = useMemo(() => {
    return activeLinks.filter((link) => {
      // 카테고리 필터
      if (selectedCategory !== "all" && link.category !== selectedCategory) {
        return false;
      }
      // 검색어 필터
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = link.title.toLowerCase().includes(query);
        const inSubtitle = link.subtitle?.toLowerCase().includes(query) ?? false;
        const inUrl = link.url.toLowerCase().includes(query);
        const inBadge = link.badge?.toLowerCase().includes(query) ?? false;
        return inTitle || inSubtitle || inUrl || inBadge;
      }
      return true;
    });
  }, [activeLinks, selectedCategory, searchQuery]);

  // 링크 클릭 핸들러 (통계 집계 후 새 탭 열기)
  const handleLinkClick = (link: LinkItem, e: React.MouseEvent) => {
    e.preventDefault();
    trackClick(activeHandle, link.id);
    if (typeof window !== "undefined") {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] pb-16 selection:bg-[#3182F6] selection:text-white antialiased">
      {/* 1. TDS Toast 메시지 (상단 중앙 플로팅) */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-200">
          <div className="bg-[#191F28] text-white text-[15px] font-medium px-5 py-3 rounded-[14px] tds-shadow-toast flex items-center gap-2.5 shadow-lg">
            <span className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center shrink-0">
              <IconCheck className="w-3.5 h-3.5 text-white" />
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 2. [A] 상단 액션 바 (구글 로그인/로그아웃 및 링크 추가) */}
      <ProfileActions
        user={currentUser}
        isAuthLoading={isAuthLoading}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onOpenAddLink={() => setIsAddLinkModalOpen(true)}
      />

      {/* 3. 메인 콘텐츠 뷰포트 (최대 576px 모바일 최적화 규격) */}
      <main className="max-w-xl mx-auto px-4 sm:px-5 pt-4 space-y-4">
        {/* [B] 프로필 히어로 카드 (로그인 유저 정보 반영) */}
        <ProfileHeader profile={profile} />

        {/* 미로그인 상태 안내 배너 */}
        {!isAuthLoading && !currentUser ? (
          <Card className="rounded-[24px] border-[#E5E8EB] bg-white text-center shadow-xs">
            <CardContent className="p-8 sm:p-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#E8F3FF] text-[#3182F6] mx-auto flex items-center justify-center shadow-2xs">
                <IconGoogle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#191F28]">
                  로그인 후 나만의 링크를 관리해 보세요
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#6B7684] leading-relaxed max-w-sm mx-auto">
                  Google 계정으로 로그인하면 내 계정 전용 링크를 안전하게 저장하고 언제 어디서나 관리할 수 있어요.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGoogleLogin}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-[15px] font-bold gap-2 cursor-pointer shadow-sm hover:scale-[1.01] transition-transform"
                >
                  <IconGoogle className="w-4 h-4 text-white" />
                  <span>Google로 로그인하고 시작하기</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* [C] 링크 & 채널 검색 및 카테고리 필터 바 */}
            <CategoryFilter
              totalCount={activeLinks.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              availableCategories={availableCategories}
              categoryCounts={categoryCounts}
              onResetFilters={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              onOpenAddLink={() => setIsAddLinkModalOpen(true)}
            />

            {/* [D] 링크 카드 리스트 스택 */}
            <LinkList
              links={filteredLinks}
              allLinks={links}
              isLoading={isLinksLoading}
              onLinkClick={handleLinkClick}
              onResetFilters={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              onOpenAddLink={() => setIsAddLinkModalOpen(true)}
              onUpdateLink={handleUpdateLink}
              onDeleteLink={handleDeleteLink}
            />
          </>
        )}

        {/* [E] 하단 푸터 (깔끔한 저작권 정보) */}
        <footer className="pt-8 pb-6 text-center">
          <div className="text-[12px] text-[#8B95A1] space-y-1">
            <p className="font-semibold text-[#6B7684]">MYLINK · 나만의 모바일 링크 허브</p>
            <p>© 2026 MyLink. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* 4. 새 링크 추가 모달 다이얼로그 (shadcn Dialog 기반) */}
      <AddLinkDialog
        open={isAddLinkModalOpen}
        onOpenChange={setIsAddLinkModalOpen}
        onAddLink={handleAddLink}
        existingLinks={links}
      />

      {/* 5. 소개 및 안내 모달 다이얼로그 (shadcn Dialog 기반) */}
      <IntroDialog open={isIntroModalOpen} onOpenChange={setIsIntroModalOpen} />
    </div>
  );
}
