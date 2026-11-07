"use client";

import React from "react";
import type { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconGoogle, IconLogOut } from "@/components/icons";

interface ProfileActionsProps {
  user: User | null;
  isAuthLoading?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenAddLink?: () => void;
}

export function ProfileActions({
  user,
  isAuthLoading = false,
  onLogin,
  onLogout,
  onOpenAddLink,
}: ProfileActionsProps) {
  const displayName = user?.displayName || user?.email?.split("@")[0] || "사용자";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E8EB]">
      <div className="max-w-xl mx-auto px-3.5 sm:px-5 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* 서비스 엠블럼 및 MVP 뱃지 */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-[8px] sm:rounded-[9px] bg-[#3182F6] flex items-center justify-center text-white font-black text-[12px] sm:text-[13px] tracking-tight select-none shadow-2xs">
            M
          </div>
          <span className="text-[15px] sm:text-[17px] font-extrabold text-[#191F28] tracking-tight">
            MYLINK
          </span>
          <Badge
            variant="brand"
            size="sm"
            className="h-[18px] px-1.5 text-[10px] font-bold rounded-[5px] ml-0.5 shrink-0"
          >
            MVP
          </Badge>
        </div>

        {/* 우측 조작 액션 (로그인/로그아웃 & 새 링크 추가) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {user ? (
            <>
              {/* 로그인 상태: "000님" + "로그아웃" 버튼 */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[12px] sm:text-[13px] font-bold text-[#191F28] max-w-[90px] sm:max-w-[120px] truncate">
                  {displayName}님
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onLogout}
                  title="로그아웃"
                  className="h-8 px-2 sm:px-2.5 text-[12px] font-medium text-[#6B7684] hover:text-[#191F28] rounded-full cursor-pointer gap-1"
                >
                  <IconLogOut className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">로그아웃</span>
                </Button>
              </div>

              {onOpenAddLink && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenAddLink}
                  title="새 링크 추가하기"
                  className="h-8 px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-bold rounded-full gap-1 cursor-pointer shadow-2xs"
                >
                  <IconPlus className="w-3.5 h-3.5 text-white" />
                  <span>새 링크</span>
                </Button>
              )}
            </>
          ) : (
            /* 로그아웃 상태: "Google로 로그인" 버튼 */
            <Button
              variant="outline"
              size="sm"
              onClick={onLogin}
              disabled={isAuthLoading}
              title="Google 계정으로 로그인"
              className="h-8 px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-semibold text-[#333D4B] border-[#D1D6DB] hover:bg-[#F2F4F6] rounded-full gap-1.5 cursor-pointer shadow-2xs"
            >
              <IconGoogle className="w-3.5 h-3.5 shrink-0" />
              <span>Google로 로그인</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
