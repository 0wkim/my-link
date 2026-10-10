"use client";

import React from "react";
import type { LinkItem } from "@/types/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconSparkles, IconChevronRight } from "@/components/icons";

interface PinnedBannerProps {
  pinnedLink?: LinkItem;
  onLinkClick: (link: LinkItem, e: React.MouseEvent) => void;
}

export function PinnedBanner({ pinnedLink, onLinkClick }: PinnedBannerProps) {
  if (!pinnedLink) return null;

  return (
    <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#3182F6] to-[#1B64DA] p-6 text-white tds-shadow-2">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Badge
            variant="outline"
            size="sm"
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm gap-1"
          >
            <IconSparkles className="w-3.5 h-3.5" />
            <span>{pinnedLink.badge || "대표 추천 링크"}</span>
          </Badge>
          <h2 className="text-[19px] sm:text-[20px] font-bold tracking-tight">
            {pinnedLink.title}
          </h2>
          <p className="text-[14px] text-blue-50/90 leading-snug break-keep max-w-md">
            {pinnedLink.subtitle}
          </p>
        </div>

        <Button
          variant="outline"
          size="default"
          onClick={(e) => onLinkClick(pinnedLink, e)}
          className="bg-white text-[#191F28] hover:bg-[#F2F4F6] border-transparent font-bold shrink-0 shadow-xs gap-1.5 cursor-pointer"
        >
          <span>지금 방문하기</span>
          <IconChevronRight className="w-4 h-4 text-[#3182F6]" />
        </Button>
      </div>
    </section>
  );
}
