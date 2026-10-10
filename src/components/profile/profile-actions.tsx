"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconShare, IconRefresh } from "@/components/icons";

interface ProfileActionsProps {
  activeHandle: string;
  onSwitchHandle: (handle: string) => void;
  onResetData: () => void;
  onShare: () => void;
}

export function ProfileActions({
  activeHandle,
  onSwitchHandle,
  onResetData,
  onShare,
}: ProfileActionsProps) {
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

        {/* 우측 조작 액션 (핸들 전환, 초기화, 공유) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 멀티 프로필 계정 전환기 (@hong / @sujin) */}
          <div className="flex items-center bg-[#F2F4F6] rounded-full p-0.5 text-[11px] sm:text-[12px] font-semibold border border-[#E5E8EB]/70">
            <button
              type="button"
              onClick={() => onSwitchHandle("hong")}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                activeHandle === "hong"
                  ? "bg-white text-[#191F28] shadow-2xs font-bold"
                  : "text-[#6B7684] hover:text-[#191F28]"
              }`}
              title="홍길동 프로필로 전환"
            >
              @hong
            </button>
            <button
              type="button"
              onClick={() => onSwitchHandle("sujin")}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                activeHandle === "sujin"
                  ? "bg-white text-[#191F28] shadow-2xs font-bold"
                  : "text-[#6B7684] hover:text-[#191F28]"
              }`}
              title="이수진 프로필로 전환"
            >
              @sujin
            </button>
          </div>

          {/* 기본 Mock 데이터 초기화 */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onResetData}
            title="기본 Mock 데이터로 초기화"
            className="w-7 h-7 sm:w-8 sm:h-8 text-[#6B7684] hover:text-[#191F28]"
          >
            <IconRefresh className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>

          {/* 프로필 공유 */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onShare}
            title="프로필 공유하기"
            className="w-7 h-7 sm:w-8 sm:h-8 text-[#4E5968] hover:text-[#191F28]"
          >
            <IconShare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
