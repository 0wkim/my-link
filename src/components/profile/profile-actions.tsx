"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconPlus } from "@/components/icons";

interface ProfileActionsProps {
  activeHandle?: string;
  onSwitchHandle?: (handle: string) => void;
  onResetData?: () => void;
  onShare?: () => void;
  onOpenAddLink?: () => void;
}

export function ProfileActions({
  onOpenAddLink,
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

        {/* 우측 조작 액션 (새 링크 추가 버튼) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
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
        </div>
      </div>
    </header>
  );
}
