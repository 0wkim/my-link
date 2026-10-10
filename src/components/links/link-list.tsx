"use client";

import React from "react";
import type { LinkItem } from "@/types/link";
import { LinkCard } from "./link-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@/components/icons";

interface LinkListProps {
  links: LinkItem[];
  onLinkClick: (link: LinkItem, e: React.MouseEvent) => void;
  onResetFilters: () => void;
}

export function LinkList({ links, onLinkClick, onResetFilters }: LinkListProps) {
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
            다른 검색어를 입력하거나 카테고리 필터를 변경해 보세요.
          </p>
          <Button
            variant="secondary"
            size="default"
            onClick={onResetFilters}
            className="cursor-pointer"
          >
            전체 링크 보기
          </Button>
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
