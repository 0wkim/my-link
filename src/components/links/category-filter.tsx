"use client";

import React from "react";
import type { LinkCategory } from "@/types/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { IconSearch, IconClose } from "@/components/icons";

export const CATEGORY_LABELS: Record<LinkCategory | "all", string> = {
  all: "전체",
  portfolio: "포트폴리오",
  blog: "블로그",
  community: "커뮤니티",
  career: "커리어",
  contact: "연락처",
  social: "소셜",
  store: "스토어",
  etc: "기타",
};

interface CategoryFilterProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: LinkCategory | "all";
  onSelectCategory: (category: LinkCategory | "all") => void;
  availableCategories: LinkCategory[];
  categoryCounts: Record<string, number>;
  onResetFilters: () => void;
}

export function CategoryFilter({
  totalCount,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  availableCategories,
  categoryCounts,
  onResetFilters,
}: CategoryFilterProps) {
  const isFiltered = searchQuery.trim() !== "" || selectedCategory !== "all";

  return (
    <section className="space-y-3">
      {/* 섹션 라벨 및 전체 카운터 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-[#8B95A1] tracking-wider uppercase">
            LINKS & CHANNELS
          </h2>
          <span className="text-[13px] font-bold text-[#3182F6] tabular-nums">
            {totalCount}개 링크
          </span>
        </div>

        {/* 필터 초기화 버튼 */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="s"
            onClick={onResetFilters}
            className="text-[12px] h-7 px-2 text-[#6B7684] hover:text-[#191F28] gap-1"
          >
            <span>필터 초기화</span>
            <IconClose className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* 검색 입력창 (shadcn Input 기반, TDS text-field 규격 48px / r12) */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#8B95A1]">
          <IconSearch className="w-4.5 h-4.5" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="링크 검색 (제목, 설명, URL)..."
          className="pl-11 pr-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-3.5 flex items-center text-[#8B95A1] hover:text-[#191F28] cursor-pointer"
            title="검색어 지우기"
          >
            <IconClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* TDS 카테고리 세그먼트 칩 (docs/design.md Chip 규격 34px pill) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <Chip
          isActive={selectedCategory === "all"}
          onClick={() => onSelectCategory("all")}
        >
          전체 ({totalCount})
        </Chip>

        {availableCategories.map((category) => {
          const count = categoryCounts[category] || 0;
          return (
            <Chip
              key={category}
              isActive={selectedCategory === category}
              onClick={() => onSelectCategory(category)}
            >
              {CATEGORY_LABELS[category] || category} ({count})
            </Chip>
          );
        })}
      </div>
    </section>
  );
}
