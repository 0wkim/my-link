"use client";

import React, { useState } from "react";
import type { LinkItem, LinkUpdateInput } from "@/types/link";
import { Badge } from "@/components/ui/badge";
import {
  IconGlobe,
  IconCursorClick,
  IconChevronRight,
  IconEdit,
  IconTrash,
  renderLinkIcon,
} from "@/components/icons";
import { InlineEditForm } from "./inline-edit-form";
import { DeleteLinkDialog } from "./delete-link-dialog";

interface LinkCardProps {
  link: LinkItem;
  existingLinks?: LinkItem[];
  onLinkClick: (link: LinkItem, e: React.MouseEvent) => void;
  onUpdateLink?: (linkId: string, input: LinkUpdateInput) => Promise<void>;
  onDeleteLink?: (linkId: string) => Promise<void>;
}

export function LinkCard({
  link,
  existingLinks = [],
  onLinkClick,
  onUpdateLink,
  onDeleteLink,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // 수정 일시 포맷팅 (updatedAt 표시)
  const formatUpdatedAt = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
        date.getDate()
      ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    } catch {
      return null;
    }
  };

  const formattedUpdatedAt = formatUpdatedAt(link.updatedAt);

  // 수정 저장 핸들러
  const handleSaveEdit = async (linkId: string, input: LinkUpdateInput) => {
    if (onUpdateLink) {
      await onUpdateLink(linkId, input);
    }
    setIsEditing(false);
  };

  // 삭제 확정 핸들러
  const handleConfirmDelete = async () => {
    if (!onDeleteLink) return;
    setIsDeleting(true);
    try {
      await onDeleteLink(link.id);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("삭제 오류:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // 인라인 수정 모드일 때 인라인 폼 렌더링
  if (isEditing) {
    return (
      <>
        <InlineEditForm
          link={link}
          existingLinks={existingLinks}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
        />
        <DeleteLinkDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          linkTitle={link.title}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative group bg-white rounded-[20px] p-4 sm:p-4.5 border border-[#E5E8EB] hover:border-[#B0B8C1] hover:shadow-xs active:scale-[0.99] transition-all select-none">
        {/* 링크 카드 전체 클릭 가능한 링크 영역 */}
        <a
          href={link.url}
          onClick={(e) => onLinkClick(link, e)}
          target="_blank"
          rel="noopener noreferrer"
          className="block pr-16 sm:pr-20 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
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
                  <Badge
                    variant="brand"
                    size="sm"
                    className="font-bold text-[10px] px-1.5 py-0.5"
                  >
                    PIN
                  </Badge>
                )}
              </div>

              {link.subtitle && (
                <p className="text-[13px] text-[#6B7684] truncate mb-1.5">
                  {link.subtitle}
                </p>
              )}

              {/* 도메인 칩 & 누적 클릭수 카운터 & 수정 시각 (updatedAt) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#8B95A1] tabular-nums">
                <span className="inline-flex items-center gap-1 font-medium text-[#6B7684]">
                  <IconGlobe className="w-3.5 h-3.5 text-[#8B95A1]" />
                  {domain}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconCursorClick className="w-3.5 h-3.5 text-[#8B95A1]" />
                  {(link.clickCount || 0).toLocaleString()}회 클릭
                </span>
                {formattedUpdatedAt && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8B95A1]">
                    <span>·</span>
                    <span>수정 {formattedUpdatedAt}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </a>

        {/* 우측 컨트롤 영역: 항상 표시되는 [수정], [삭제] 버튼 및 화살표 */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* 수정 버튼 (항상 표시) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7684] hover:text-[#3182F6] hover:bg-[#E8F3FF] active:scale-95 transition-all cursor-pointer"
            title="링크 수정"
            aria-label="링크 수정"
          >
            <IconEdit className="w-4 h-4" />
          </button>

          {/* 삭제 버튼 (항상 표시) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B95A1] hover:text-[#F04452] hover:bg-[#FEECEE] active:scale-95 transition-all cursor-pointer"
            title="링크 삭제"
            aria-label="링크 삭제"
          >
            <IconTrash className="w-4 h-4" />
          </button>

          {/* Chevron 화살표 */}
          <div className="w-6 h-6 flex items-center justify-center text-[#B0B8C1] group-hover:text-[#3182F6] group-hover:translate-x-0.5 transition-all shrink-0 pointer-events-none hidden sm:flex">
            <IconChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 다이얼로그 */}
      <DeleteLinkDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        linkTitle={link.title}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
