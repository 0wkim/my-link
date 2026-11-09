"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { UserProfileData, LinkItem, LinkCategory } from "@/types/link";
import { auth } from "@/lib/firebase";
import { incrementLinkClickCount } from "@/lib/firestore-links";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconVerified,
  IconExternalLink,
  renderLinkIcon,
} from "@/components/icons";

interface PublicProfileViewProps {
  profile: UserProfileData;
  links: LinkItem[];
}

export function PublicProfileView({ profile, links }: PublicProfileViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<LinkCategory | "all">("all");
  const [profileLinks, setProfileLinks] = useState(links);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsAuthResolved(true);
    });
  }, []);

  // 활성화된 링크 필터링 및 고정/최신순 정렬
  const activeLinks = useMemo(() => {
    return profileLinks
      .filter((link) => link.isActive)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [profileLinks]);

  // 카테고리 필터링
  const filteredLinks = useMemo(() => {
    if (selectedCategory === "all") return activeLinks;
    return activeLinks.filter((link) => link.category === selectedCategory);
  }, [activeLinks, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set<LinkCategory>();
    activeLinks.forEach((l) => {
      if (l.category) cats.add(l.category);
    });
    return Array.from(cats);
  }, [activeLinks]);

  const handleLinkClick = (link: LinkItem) => {
    // 로그인 상태 확인 전 또는 링크 제작자 본인의 클릭은 집계하지 않습니다.
    if (!isAuthResolved || authUser?.uid === profile.uid) return;

    setProfileLinks((currentLinks) =>
      currentLinks.map((currentLink) =>
        currentLink.id === link.id
          ? { ...currentLink, clickCount: currentLink.clickCount + 1 }
          : currentLink
      )
    );

    void incrementLinkClickCount(link.id, profile.uid).catch((error) => {
      console.warn("링크 클릭 수 저장에 실패했습니다.", error);
      setProfileLinks((currentLinks) =>
        currentLinks.map((currentLink) =>
          currentLink.id === link.id
            ? { ...currentLink, clickCount: Math.max(0, currentLink.clickCount - 1) }
            : currentLink
        )
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] pb-16 selection:bg-[#3182F6] selection:text-white antialiased">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="max-w-xl mx-auto px-4 sm:px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-[9px] bg-[#3182F6] flex items-center justify-center text-white font-black text-[13px] tracking-tight shadow-2xs">
              M
            </div>
            <span className="text-[17px] font-extrabold text-[#191F28] tracking-tight">
              MYLINK
            </span>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-full text-[12px] font-semibold text-[#4E5968] border-[#D1D6DB] hover:bg-[#F2F4F6] cursor-pointer shadow-2xs"
            >
              나도 링크 만들기
            </Button>
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-xl mx-auto px-4 sm:px-5 pt-4 space-y-4">
        {/* 프로필 카드 */}
        <Card className="rounded-[24px] border-[#E5E8EB] bg-white">
          <CardContent className="p-6 sm:p-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3FF] text-[#3182F6] text-[13px] font-semibold mb-5">
              <span className="w-2 h-2 rounded-full bg-[#3182F6] animate-pulse" />
              <span>공유된 프로필 페이지</span>
            </div>

            <div className="flex items-start gap-4 sm:gap-5">
              <Avatar size="xl">
                {profile.avatarUrl ? (
                  <AvatarImage
                    src={profile.avatarUrl}
                    alt={`${profile.displayName} 아바타`}
                  />
                ) : (
                  <AvatarFallback>{profile.displayName?.[0] || "U"}</AvatarFallback>
                )}
                <AvatarBadge />
              </Avatar>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-[#191F28] tracking-tight leading-tight truncate">
                    {profile.displayName}
                  </h1>
                  <IconVerified className="w-5 h-5 text-[#3182F6] shrink-0" />
                </div>
                <p className="text-[14px] sm:text-[15px] font-medium text-[#4E5968] mb-1">
                  @{profile.username} · {profile.role || "마이링크 멤버"}
                </p>
              </div>
            </div>

            {profile.bio && (
              <p className="text-[15px] sm:text-[16px] text-[#333D4B] leading-relaxed break-keep mt-5">
                {profile.bio}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 카테고리 필터 (카테고리가 2개 이상일 때 노출) */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === "all"
                  ? "bg-[#191F28] text-white"
                  : "bg-white text-[#6B7684] hover:bg-[#F2F4F6] border border-[#E5E8EB]"
              }`}
            >
              전체 {activeLinks.length}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#191F28] text-white"
                    : "bg-white text-[#6B7684] hover:bg-[#F2F4F6] border border-[#E5E8EB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* 링크 목록 */}
        <div className="space-y-3">
          {filteredLinks.length === 0 ? (
            <Card className="rounded-[20px] border-[#E5E8EB] bg-white text-center p-8">
              <p className="text-[15px] font-medium text-[#8B95A1]">
                등록된 링크가 아직 없어요.
              </p>
            </Card>
          ) : (
            filteredLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className="group relative flex items-center justify-between p-4 sm:p-4.5 bg-white rounded-[20px] border border-[#E5E8EB] hover:border-[#3182F6] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                  {/* 아이콘 */}
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: link.iconBg || "#E8F3FF",
                      color: link.iconColor || "#3182F6",
                    }}
                  >
                    {renderLinkIcon(link.iconType, "w-5 h-5")}
                  </div>

                  {/* 제목 및 부제목 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[16px] font-bold text-[#191F28] group-hover:text-[#3182F6] transition-colors truncate">
                        {link.title}
                      </span>
                      {link.isPinned && (
                        <Badge
                          variant="brand"
                          size="sm"
                          className="font-bold text-[10px] px-1.5 py-0.5"
                        >
                          PIN
                        </Badge>
                      )}
                      {link.badge && (
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="h-5 px-1.5 text-[11px] font-bold rounded-[6px]"
                        >
                          {link.badge}
                        </Badge>
                      )}
                    </div>
                    {link.subtitle && (
                      <p className="text-[13px] text-[#6B7684] truncate mt-0.5">
                        {link.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* 우측 이동 아이콘 */}
                <div className="w-8 h-8 rounded-full bg-[#F2F4F6] group-hover:bg-[#E8F3FF] flex items-center justify-center shrink-0 transition-colors">
                  <IconExternalLink className="w-4 h-4 text-[#8B95A1] group-hover:text-[#3182F6] transition-colors" />
                </div>
              </a>
            ))
          )}
        </div>

        {/* 푸터 */}
        <footer className="pt-8 pb-6 text-center">
          <div className="text-[12px] text-[#8B95A1] space-y-1">
            <p className="font-semibold text-[#6B7684]">MYLINK · 나만의 모바일 링크 허브</p>
            <p>© 2026 MyLink. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
