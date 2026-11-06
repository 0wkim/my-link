"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LinkItem, LinkUpdateInput, LinkCategory, IconType } from "@/types/link";
import {
  baseAddLinkSchema,
  normalizeUrl,
  type AddLinkFormValues,
} from "./add-link-dialog";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconCheck,
  IconClose,
  IconGlobe,
  renderLinkIcon,
} from "@/components/icons";
import { CATEGORY_LABELS } from "./category-filter";

const ICON_OPTIONS: Array<{
  type: IconType;
  label: string;
  defaultBg: string;
  defaultColor: string;
}> = [
  { type: "globe", label: "웹사이트", defaultBg: "#E8F3FF", defaultColor: "#3182F6" },
  { type: "github", label: "GitHub", defaultBg: "#191F28", defaultColor: "#FFFFFF" },
  { type: "sparkles", label: "하이라이트", defaultBg: "#FEF9C3", defaultColor: "#CA8A04" },
  { type: "blog", label: "블로그", defaultBg: "#E0F2FE", defaultColor: "#0284C7" },
  { type: "mail", label: "이메일", defaultBg: "#E8F3FF", defaultColor: "#3182F6" },
  { type: "coffee", label: "커피챗", defaultBg: "#FFF4E6", defaultColor: "#EA580C" },
  { type: "file-text", label: "이력서/문서", defaultBg: "#F1F5F9", defaultColor: "#475569" },
  { type: "store", label: "스토어/펀딩", defaultBg: "#ECFDF5", defaultColor: "#059669" },
  { type: "youtube", label: "YouTube", defaultBg: "#FEECEE", defaultColor: "#F04452" },
  { type: "instagram", label: "Instagram", defaultBg: "#FCE7F3", defaultColor: "#DB2777" },
  { type: "twitter", label: "X / 트위터", defaultBg: "#191F28", defaultColor: "#FFFFFF" },
  { type: "linkedin", label: "LinkedIn", defaultBg: "#E0F2FE", defaultColor: "#0077B5" },
  { type: "discord", label: "Discord", defaultBg: "#EEF2FF", defaultColor: "#5865F2" },
  { type: "code", label: "코드", defaultBg: "#F3E8FF", defaultColor: "#9333EA" },
  { type: "link", label: "일반 링크", defaultBg: "#F2F4F6", defaultColor: "#4E5968" },
];

const COLOR_PRESETS = [
  { bg: "#E8F3FF", color: "#3182F6", label: "토스 블루" },
  { bg: "#191F28", color: "#FFFFFF", label: "다크 블랙" },
  { bg: "#ECFDF5", color: "#059669", label: "에메랄드" },
  { bg: "#FFF4E6", color: "#EA580C", label: "오렌지" },
  { bg: "#FEECEE", color: "#F04452", label: "레드" },
  { bg: "#FCE7F3", color: "#DB2777", label: "핑크" },
  { bg: "#F3E8FF", color: "#9333EA", label: "퍼플" },
  { bg: "#F2F4F6", color: "#4E5968", label: "모노 그레이" },
];

const QUICK_BADGES = ["대표 링크", "NEW", "추천", "HOT", "30분 무료"];

interface InlineEditFormProps {
  link: LinkItem;
  existingLinks?: LinkItem[];
  onSave: (linkId: string, input: LinkUpdateInput) => Promise<void>;
  onCancel: () => void;
}

export function InlineEditForm({
  link,
  existingLinks = [],
  onSave,
  onCancel,
}: InlineEditFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  // 현재 링크를 제외한 다른 링크들의 URL 목록 (중복 체크용)
  const otherExistingUrls = useMemo(() => {
    return existingLinks
      .filter((l) => l.id !== link.id)
      .map((l) => normalizeUrl(l.url).toLowerCase());
  }, [existingLinks, link.id]);

  const editSchema = useMemo(() => {
    return baseAddLinkSchema.superRefine((data, ctx) => {
      const normalized = normalizeUrl(data.url).toLowerCase();
      if (otherExistingUrls.includes(normalized)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["url"],
          message: "이미 등록된 동일한 링크 주소가 있어요.",
        });
      }
    });
  }, [otherExistingUrls]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(editSchema),
    mode: "onChange",
    defaultValues: {
      title: link.title,
      url: link.url,
      subtitle: link.subtitle || "",
      category: link.category,
      iconType: link.iconType,
      iconBg: link.iconBg || "#E8F3FF",
      iconColor: link.iconColor || "#3182F6",
      badge: link.badge || "",
      isPinned: link.isPinned ?? false,
    },
  });

  const watchTitle = watch("title");
  const watchUrl = watch("url");
  const watchSubtitle = watch("subtitle") || "";
  const watchCategory = watch("category");
  const watchIconType = watch("iconType");
  const watchIconBg = watch("iconBg");
  const watchIconColor = watch("iconColor");
  const watchBadge = watch("badge") || "";
  const watchIsPinned = watch("isPinned");

  const handleIconSelect = (option: (typeof ICON_OPTIONS)[0]) => {
    setValue("iconType", option.type, { shouldValidate: true });
    setValue("iconBg", option.defaultBg, { shouldValidate: true });
    setValue("iconColor", option.defaultColor, { shouldValidate: true });
  };

  const onSubmit = async (data: AddLinkFormValues) => {
    const finalUrl = normalizeUrl(data.url);
    setIsSaving(true);
    try {
      await onSave(link.id, {
        title: data.title.trim(),
        url: finalUrl,
        subtitle: data.subtitle?.trim() || undefined,
        category: data.category,
        iconType: data.iconType,
        iconBg: data.iconBg,
        iconColor: data.iconColor,
        badge: data.badge?.trim() || undefined,
        isPinned: data.isPinned,
      });
    } catch (err) {
      console.error("수정 저장 오류:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const previewDomain = useMemo(() => {
    if (!watchUrl?.trim()) return "link.domain";
    try {
      const normalized = normalizeUrl(watchUrl);
      if (normalized.startsWith("mailto:")) return "이메일";
      if (normalized.startsWith("tel:")) return "전화";
      const parsed = new URL(normalized);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return watchUrl.split("/")[0] || "link.domain";
    }
  }, [watchUrl]);

  return (
    <div className="bg-white rounded-[20px] p-5 border-2 border-[#3182F6] shadow-sm animate-in fade-in duration-150 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5E8EB] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3182F6] animate-pulse" />
          <h4 className="text-[15px] font-bold text-[#191F28]">링크 인라인 수정</h4>
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="text-[#8B95A1] hover:text-[#191F28] p-1 rounded-full hover:bg-[#F2F4F6] transition-colors cursor-pointer"
          title="취소"
        >
          <IconClose className="w-4 h-4" />
        </button>
      </div>

      {/* 미리보기 영역 */}
      <div className="bg-[#F9FAFB] p-3 rounded-[14px] border border-[#E5E8EB] flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: watchIconBg, color: watchIconColor }}
        >
          {renderLinkIcon(watchIconType, "w-5 h-5")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-[#191F28] truncate">
              {watchTitle?.trim() || "제목을 입력해 주세요"}
            </span>
            {watchBadge?.trim() && (
              <Badge variant="secondary" size="sm" className="font-bold text-[10px]">
                {watchBadge.trim()}
              </Badge>
            )}
            {watchIsPinned && (
              <Badge variant="brand" size="sm" className="font-bold text-[10px] px-1.5 py-0.5">
                PIN
              </Badge>
            )}
          </div>
          <p className="text-[12px] text-[#6B7684] truncate">
            {watchSubtitle?.trim() || "보조 설명 없음"}
          </p>
          <div className="text-[11px] text-[#8B95A1] flex items-center gap-1 mt-0.5">
            <IconGlobe className="w-3 h-3 text-[#8B95A1]" />
            <span className="truncate">{previewDomain}</span>
          </div>
        </div>
      </div>

      {/* 폼 입력 영역 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* 링크 제목 */}
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#333D4B] flex items-center justify-between">
            <span>
              링크 제목 <span className="text-[#F04452]">*</span>
            </span>
            <span
              className={`text-[11px] font-semibold tabular-nums ${
                (watchTitle?.length || 0) >= 40 ? "text-[#F04452]" : "text-[#8B95A1]"
              }`}
            >
              {watchTitle?.length || 0}/40자
            </span>
          </label>
          <Input
            type="text"
            {...register("title")}
            placeholder="링크 제목 입력"
            isError={!!errors.title}
          />
          {errors.title?.message && (
            <p className="text-[12px] text-[#F04452] font-medium pl-1">
              ⚠️ {errors.title.message}
            </p>
          )}
        </div>

        {/* 목적지 URL */}
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#333D4B] flex items-center justify-between">
            <span>
              목적지 URL <span className="text-[#F04452]">*</span>
            </span>
            <span className="text-[11px] font-normal text-[#8B95A1]">
              웹 주소, 이메일, 전화
            </span>
          </label>
          <Input
            type="text"
            {...register("url")}
            placeholder="https://example.com"
            isError={!!errors.url}
          />
          {errors.url?.message && (
            <p className="text-[12px] text-[#F04452] font-medium pl-1">
              ⚠️ {errors.url.message}
            </p>
          )}
        </div>

        {/* 보조 설명 문구 */}
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#333D4B] flex items-center justify-between">
            <span>보조 설명 문구 (선택)</span>
            <span className="text-[11px] font-semibold text-[#8B95A1] tabular-nums">
              {watchSubtitle?.length || 0}/60자
            </span>
          </label>
          <Input
            type="text"
            {...register("subtitle")}
            placeholder="보조 설명 문구 입력"
            isError={!!errors.subtitle}
          />
          {errors.subtitle?.message && (
            <p className="text-[12px] text-[#F04452] font-medium pl-1">
              {errors.subtitle.message}
            </p>
          )}
        </div>

        {/* 카테고리 선택 */}
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#333D4B]">카테고리</label>
          <div className="flex flex-wrap gap-1">
            {(
              [
                "portfolio",
                "blog",
                "social",
                "career",
                "contact",
                "store",
                "community",
                "etc",
              ] as LinkCategory[]
            ).map((cat) => {
              const isSelected = watchCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setValue("category", cat, { shouldValidate: true })}
                  className={`h-7 px-2.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#191F28] text-white font-bold"
                      : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 대표 아이콘 */}
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#333D4B]">대표 아이콘</label>
          <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto p-1 bg-[#F9FAFB] rounded-[12px] border border-[#E5E8EB]">
            {ICON_OPTIONS.map((item) => {
              const isSelected = watchIconType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleIconSelect(item)}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-[8px] text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white ring-2 ring-[#3182F6] shadow-2xs text-[#3182F6]"
                      : "hover:bg-white text-[#4E5968]"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-[6px] flex items-center justify-center mb-0.5"
                    style={{
                      backgroundColor: isSelected ? item.defaultBg : "#F2F4F6",
                      color: isSelected ? item.defaultColor : "#6B7684",
                    }}
                  >
                    {renderLinkIcon(item.type, "w-3.5 h-3.5")}
                  </div>
                  <span className="text-[9px] font-medium truncate w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 아이콘 색상 커스텀 */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[#6B7684]">
            아이콘 색상 스타일
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {COLOR_PRESETS.map((p) => {
              const isSelected = watchIconBg === p.bg && watchIconColor === p.color;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setValue("iconBg", p.bg, { shouldValidate: true });
                    setValue("iconColor", p.color, { shouldValidate: true });
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-[8px] border text-[10px] font-medium transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "border-[#3182F6] bg-white text-[#3182F6] ring-1 ring-[#3182F6] font-bold"
                      : "border-[#E5E8EB] bg-[#F9FAFB] text-[#4E5968] hover:bg-white"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 강조 배지 */}
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-[#333D4B] flex items-center justify-between">
            <span>강조 배지 (선택)</span>
            <span className="text-[11px] font-semibold text-[#8B95A1] tabular-nums">
              {watchBadge?.length || 0}/15자
            </span>
          </label>
          <Input
            type="text"
            {...register("badge")}
            placeholder="예: 대표 링크, NEW"
            isError={!!errors.badge}
          />
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[10px] text-[#8B95A1] shrink-0">추천:</span>
            {QUICK_BADGES.map((qb) => (
              <button
                key={qb}
                type="button"
                onClick={() => setValue("badge", qb, { shouldValidate: true })}
                className={`px-1.5 py-0.5 rounded-[4px] text-[10px] cursor-pointer shrink-0 ${
                  watchBadge === qb
                    ? "bg-[#3182F6] text-white font-bold"
                    : "bg-[#F2F4F6] text-[#6B7684] hover:text-[#191F28]"
                }`}
              >
                {qb}
              </button>
            ))}
            {watchBadge && (
              <button
                type="button"
                onClick={() => setValue("badge", "", { shouldValidate: true })}
                className="text-[10px] text-[#8B95A1] hover:text-[#F04452] ml-1 cursor-pointer shrink-0"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* 상단 고정 체크박스 */}
        <label className="flex items-center gap-2 p-2.5 rounded-[10px] bg-[#F9FAFB] border border-[#E5E8EB] cursor-pointer hover:bg-[#F2F4F6] transition-colors">
          <input
            type="checkbox"
            {...register("isPinned")}
            className="w-4 h-4 accent-[#3182F6] rounded-[4px] cursor-pointer"
          />
          <span className="text-[12px] font-bold text-[#191F28]">
            목록 최상단에 고정 (PIN)
          </span>
        </label>

        {/* 하단 액션 버튼 */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E8EB]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSaving}
            onClick={onCancel}
            className="cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            className="cursor-pointer gap-1.5 shadow-2xs disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>저장하는 중...</span>
              </>
            ) : (
              <>
                <IconCheck className="w-3.5 h-3.5 text-white" />
                <span>수정 저장</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
