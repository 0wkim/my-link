"use client";

import React from "react";
import type { LinkItem } from "@/types/link";
import { LinkCard } from "./link-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconSearch, IconPlus } from "@/components/icons";

interface LinkListProps {
  links: LinkItem[];
  onLinkClick: (link: LinkItem, e: React.MouseEvent) => void;
  onResetFilters: () => void;
  onOpenAddLink?: () => void;
}

export function LinkList({
  links,
  onLinkClick,
  onResetFilters,
  onOpenAddLink,
}: LinkListProps) {
  if (links.length === 0) {
    return (
      <Card className="rounded-[24px] text-center border-[#E5E8EB]">
        <CardContent className="p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F2F4F6] text-[#8B95A1] mx-auto flex items-center justify-center">
            <IconSearch className="w-6 h-6" />
          </div>
          <p className="text-[16px] font-bold text-[#191F28]">
            검색 조건에 맞는 링크가 없어요
          </p>
          <p className="text-[14px] text-[#6B7684]">
            다른 검색어를 입력하거나 새 링크를 추가해 보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
            <Button
              variant="secondary"
              size="default"
              onClick={onResetFilters}
              className="w-full sm:w-auto cursor-pointer"
            >
              전체 링크 보기
            </Button>
            {onOpenAddLink && (
              <Button
                variant="primary"
                size="default"
                onClick={onOpenAddLink}
                className="w-full sm:w-auto cursor-pointer gap-1.5 shadow-2xs"
              >
                <IconPlus className="w-4 h-4 text-white" />
                <span>새 링크 추가하기</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onLinkClick={onLinkClick} />
      ))}
    </section>
  );
}
