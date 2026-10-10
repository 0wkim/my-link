"use client";

import React from "react";
import type { LinkItem } from "@/types/link";
import { Badge } from "@/components/ui/badge";
import {
  IconGlobe,
  IconCursorClick,
  IconChevronRight,
  renderLinkIcon,
} from "@/components/icons";

interface LinkCardProps {
  link: LinkItem;
  onLinkClick: (link: LinkItem, e: React.MouseEvent) => void;
}

export function LinkCard({ link, onLinkClick }: LinkCardProps) {
  const getDomainFromUrl = (url: string) => {
    try {
      if (url.startsWith("mailto:")) return "이메일";
      if (url.startsWith("tel:")) return "전화";
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url.split("/")[0] || "link";
    }
  };

  const domain = getDomainFromUrl(link.url);

  return (
    <a
      href={link.url}
      onClick={(e) => onLinkClick(link, e)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-[20px] p-4 sm:p-4.5 border border-[#E5E8EB] hover:border-[#B0B8C1] hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer select-none"
    >
      <div className="flex items-center justify-between gap-3.5">
        {/* 좌측: 44x44px 컬러 아이콘 박스 */}
        <div
          className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: link.iconBg || "#E8F3FF",
            color: link.iconColor || "#3182F6",
          }}
        >
          {renderLinkIcon(link.iconType, "w-5 h-5")}
        </div>

        {/* 중앙: 링크 제목, 설명, 뱃지, 도메인/통계 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[16px] font-bold text-[#191F28] group-hover:text-[#3182F6] transition-colors truncate">
              {link.title}
            </span>
            {link.badge && (
              <Badge variant="secondary" size="sm" className="font-bold">
                {link.badge}
              </Badge>
            )}
            {link.isPinned && (
              <Badge variant="brand" size="sm" className="font-bold text-[10px] px-1.5 py-0.5">
                PIN
              </Badge>
            )}
          </div>

          {link.subtitle && (
            <p className="text-[13px] text-[#6B7684] truncate mb-1.5">
              {link.subtitle}
            </p>
          )}

          {/* 도메인 칩 & 누적 클릭수 카운터 */}
          <div className="flex items-center gap-3 text-[12px] text-[#8B95A1] tabular-nums">
            <span className="inline-flex items-center gap-1 font-medium text-[#6B7684]">
              <IconGlobe className="w-3.5 h-3.5 text-[#8B95A1]" />
              {domain}
            </span>
            <span className="inline-flex items-center gap-1">
              <IconCursorClick className="w-3.5 h-3.5 text-[#8B95A1]" />
              {(link.clickCount || 0).toLocaleString()}회 클릭
            </span>
          </div>
        </div>

        {/* 우측: Chevron 화살표 인터랙션 */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#B0B8C1] group-hover:text-[#3182F6] group-hover:translate-x-1 transition-all shrink-0">
          <IconChevronRight className="w-5 h-5" />
        </div>
      </div>
    </a>
  );
}
