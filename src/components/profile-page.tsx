"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProfileStore } from "@/store/profile-store";
import type { LinkItem, LinkCategory, LinkCreateInput } from "@/types/link";
import { ProfileActions } from "@/components/profile/profile-actions";
import { ProfileHeader } from "@/components/profile/profile-header";
import { CategoryFilter } from "@/components/links/category-filter";
import { LinkList } from "@/components/links/link-list";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import { IntroDialog } from "@/components/profile/intro-dialog";
import { IconCheck } from "@/components/icons";

interface ProfilePageProps {
  initialHandle?: string;
}

export default function ProfilePage({ initialHandle = "hong" }: ProfilePageProps) {
  const normalizedInitial = initialHandle.replace(/^@/, "");

  // Zustand 스토어 상태 및 액션
  const profiles = useProfileStore((s) => s.profiles);
  const currentHandle = useProfileStore((s) => s.currentHandle);
  const addLink = useProfileStore((s) => s.addLink);
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

  // 새 링크 추가 핸들러 (Firestore 저장 → 로컬 즉시 반영 → Firestore 재조회로 목록 갱신)
  const handleAddLink = async (input: LinkCreateInput) => {
    try {
      const newLink = await addLink(activeHandle, input);
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
      await syncFirestoreLinks(activeHandle);
    } catch (error) {
      console.error("링크 추가 중 오류 발생:", error);
      showToast("링크 추가 중 오류가 발생했습니다.");
    } finally {
      setIsLinksLoading(false);
    }
  };

  // 활성 엔트리 (hong 고정)
  const activeHandle = "hong";

  // 마운트 또는 핸들 변경 시 뷰 카운트 1 증가 및 Firestore 링크 조회
  useEffect(() => {
    trackView(activeHandle);
    setIsLinksLoading(true);
    // users/anonymous/links 에서 createdAt 최신순으로 조회
    syncFirestoreLinks(activeHandle).finally(() => {
      setIsLinksLoading(false);
    });
  }, [activeHandle, trackView, syncFirestoreLinks]);

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
  // Firestore 구독이 createdAt desc 순으로 반환하므로 배열 순서를 유지하고, isPinned만 최상단으로 올림
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

      {/* 2. [A] 상단 액션 바 (새 링크 추가 버튼) */}
      <ProfileActions
        onOpenAddLink={() => setIsAddLinkModalOpen(true)}
      />

      {/* 3. 메인 콘텐츠 뷰포트 (최대 576px 모바일 최적화 규격) */}
      <main className="max-w-xl mx-auto px-4 sm:px-5 pt-4 space-y-4">
        {/* [B] 프로필 히어로 카드 */}
        <ProfileHeader profile={profile} />

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
          isLoading={isLinksLoading}
          onLinkClick={handleLinkClick}
          onResetFilters={() => {
            setSearchQuery("");
            setSelectedCategory("all");
          }}
          onOpenAddLink={() => setIsAddLinkModalOpen(true)}
        />

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
