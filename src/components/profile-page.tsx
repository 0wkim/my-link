"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile-store";
import type { LinkItem, LinkCategory } from "@/types/link";
import { ProfileActions } from "@/components/profile/profile-actions";
import { ProfileHeader } from "@/components/profile/profile-header";
import { CategoryFilter } from "@/components/links/category-filter";
import { LinkList } from "@/components/links/link-list";
import { IntroDialog } from "@/components/profile/intro-dialog";
import { IconCheck } from "@/components/icons";

interface ProfilePageProps {
  initialHandle?: string;
}

export default function ProfilePage({ initialHandle = "hong" }: ProfilePageProps) {
  const router = useRouter();
  const normalizedInitial = initialHandle.replace(/^@/, "");

  // Zustand 스토어 상태 및 액션
  const profiles = useProfileStore((s) => s.profiles);
  const currentHandle = useProfileStore((s) => s.currentHandle);
  const setCurrentHandle = useProfileStore((s) => s.setCurrentHandle);
  const trackClick = useProfileStore((s) => s.trackClick);
  const trackView = useProfileStore((s) => s.trackView);
  const resetToMockData = useProfileStore((s) => s.resetToMockData);

  // 현재 사용자가 직접 클릭하여 선택한 임시 오버라이드 핸들
  const [overrideHandle, setOverrideHandle] = useState<string | null>(null);
  const [prevInitial, setPrevInitial] = useState(normalizedInitial);

  // URL props(initialHandle) 변경 시 오버라이드 초기화 (React 공식 권장 패턴)
  if (normalizedInitial !== prevInitial) {
    setPrevInitial(normalizedInitial);
    setOverrideHandle(null);
  }

  // 로컬 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LinkCategory | "all">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);

  // 활성 엔트리 (오버라이드 -> props -> 스토어 -> 기본값)
  const activeHandle = overrideHandle || normalizedInitial || currentHandle || "hong";

  // 마운트 또는 핸들 변경 시 뷰 카운트 1 증가
  useEffect(() => {
    trackView(activeHandle);
  }, [activeHandle, trackView]);

  const userEntry = profiles[activeHandle] || profiles.hong;
  const profile = userEntry?.profile;
  const rawLinks = userEntry?.links;
  const links = useMemo(() => rawLinks || [], [rawLinks]);

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
        return a.displayOrder - b.displayOrder;
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

  // 프로필 공유하기
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.displayName}님의 마이링크`,
          text: profile?.bio || "나만의 모바일 링크 허브를 확인해 보세요.",
          url: shareUrl,
        });
        return;
      } catch {
        // 취소된 경우 폴백 클립보드 복사
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("프로필 주소를 클립보드에 복사했어요");
    } catch {
      showToast(`프로필 주소: ${shareUrl}`);
    }
  };

  // 이메일 복사하기
  const handleCopyEmail = async () => {
    if (!profile?.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      showToast("이메일 주소를 복사했어요");
    } catch {
      showToast(profile.email);
    }
  };

  // Mock 데이터 초기화 핸들러
  const handleResetData = () => {
    if (confirm("모든 데이터를 기본 Mock 시드 데이터로 초기화할까요?")) {
      resetToMockData();
      showToast("기본 Mock 데이터로 초기화했어요");
    }
  };

  // 핸들 전환 (멀티 프로필 즉각 전환 및 URL 라우팅)
  const handleSwitchHandle = (targetHandle: string) => {
    setOverrideHandle(targetHandle);
    setCurrentHandle(targetHandle);
    router.push(`/@${targetHandle}`);
    showToast(`@${targetHandle} 프로필로 전환했어요`);
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

      {/* 2. [A] 상단 액션 바 (shadcn 컴포넌트 기반) */}
      <ProfileActions
        activeHandle={activeHandle}
        onSwitchHandle={handleSwitchHandle}
        onResetData={handleResetData}
        onShare={handleShare}
      />

      {/* 3. 메인 콘텐츠 뷰포트 (최대 576px 모바일 최적화 규격) */}
      <main className="max-w-xl mx-auto px-4 sm:px-5 pt-4 space-y-4">
        {/* [B] 프로필 히어로 카드 */}
        <ProfileHeader profile={profile} onCopyEmail={handleCopyEmail} />

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
        />

        {/* [D] 링크 카드 리스트 스택 */}
        <LinkList
          links={filteredLinks}
          onLinkClick={handleLinkClick}
          onResetFilters={() => {
            setSearchQuery("");
            setSelectedCategory("all");
          }}
        />

        {/* [E] 하단 푸터 (깔끔한 저작권 정보) */}
        <footer className="pt-8 pb-6 text-center">
          <div className="text-[12px] text-[#8B95A1] space-y-1">
            <p className="font-semibold text-[#6B7684]">MYLINK · 나만의 모바일 링크 허브</p>
            <p>© 2026 MyLink. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* 4. 소개 및 안내 모달 다이얼로그 (shadcn Dialog 기반) */}
      <IntroDialog open={isIntroModalOpen} onOpenChange={setIsIntroModalOpen} />
    </div>
  );
}
