"use client";

import React, { useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LinkCreateInput, LinkCategory, IconType, LinkItem } from "@/types/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconPlus,
  IconGlobe,
  renderLinkIcon,
} from "@/components/icons";
import { CATEGORY_LABELS } from "./category-filter";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLink: (input: LinkCreateInput) => void;
  existingLinks?: LinkItem[];
}

// 아이콘 프리셋 목록
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

// 컬러 팔레트 프리셋
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

/**
 * URL 표준화 정규화 헬퍼
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }
  // 순수 이메일 형식이면 mailto: 자동 부착
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`;
  }
  // 전화번호 형식이면 tel: 부착
  if (/^(\+?\d{2,4}-?\d{3,4}-?\d{4})$/.test(trimmed)) {
    return `tel:${trimmed}`;
  }
  return `https://${trimmed}`;
}

/**
 * Zod 스키마 정의 (TDS 및 PRD 입력 검증 규격)
 */
export const baseAddLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "링크 제목을 입력해 주세요.")
    .min(2, "제목은 최소 2자 이상 입력해 주세요.")
    .max(40, "제목은 최대 40자까지 입력 가능해요."),
  url: z
    .string()
    .trim()
    .min(1, "목적지 URL을 입력해 주세요.")
    .refine((val) => !/\s/.test(val), {
      message: "URL에는 공백이 포함될 수 없어요.",
    })
    .refine((val) => !/^(javascript|vbscript|data):/i.test(val), {
      message: "보안상 허용되지 않는 URL 형식이에요.",
    })
    .refine(
      (val) => {
        if (val.startsWith("mailto:")) {
          const email = val.replace(/^mailto:/, "").split("?")[0];
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return true;
        }
        if (val.startsWith("tel:")) {
          return val.length > 4;
        }
        const withScheme = /^https?:\/\//i.test(val) ? val : `https://${val}`;
        try {
          const parsed = new URL(withScheme);
          return (
            (parsed.hostname === "localhost" || parsed.hostname.includes(".")) &&
            !parsed.hostname.startsWith(".") &&
            !parsed.hostname.endsWith(".")
          );
        } catch {
          return false;
        }
      },
      {
        message: "올바른 웹 주소(예: https://example.com) 형식을 입력해 주세요.",
      }
    ),
  subtitle: z.string().max(60, "보조 설명은 최대 60자까지 입력 가능해요."),
  category: z.enum([
    "portfolio",
    "blog",
    "social",
    "career",
    "contact",
    "store",
    "community",
    "etc",
  ]),
  iconType: z.enum([
    "globe",
    "github",
    "blog",
    "mail",
    "coffee",
    "file-text",
    "instagram",
    "youtube",
    "twitter",
    "linkedin",
    "discord",
    "store",
    "code",
    "briefcase",
    "sparkles",
    "link",
  ]),
  iconBg: z.string(),
  iconColor: z.string(),
  badge: z.string().max(15, "배지 문구는 최대 15자까지 입력 가능해요."),
  isPinned: z.boolean(),
});

export function createAddLinkSchema(existingUrls: string[] = []) {
  return baseAddLinkSchema.superRefine((data, ctx) => {
    const normalized = normalizeUrl(data.url).toLowerCase();
    if (existingUrls.includes(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["url"],
        message: "이미 등록된 동일한 링크 주소가 있어요.",
      });
    }
  });
}

export type AddLinkFormValues = z.infer<typeof baseAddLinkSchema>;

export function AddLinkDialog({
  open,
  onOpenChange,
  onAddLink,
  existingLinks = [],
}: AddLinkDialogProps) {
  // 기존 등록된 URL 목록 (소문자 표준화)
  const existingNormalizedUrls = useMemo(() => {
    return existingLinks.map((l) => normalizeUrl(l.url).toLowerCase());
  }, [existingLinks]);

  // React Hook Form + Zod Resolver
  const formSchema = useMemo(() => {
    return createAddLinkSchema(existingNormalizedUrls);
  }, [existingNormalizedUrls]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      url: "",
      subtitle: "",
      category: "portfolio",
      iconType: "globe",
      iconBg: "#E8F3FF",
      iconColor: "#3182F6",
      badge: "",
      isPinned: false,
    },
  });

  // 실시간 미리보기 및 UI 바인딩용 감시 변수
  const watchTitle = watch("title");
  const watchUrl = watch("url");
  const watchSubtitle = watch("subtitle") || "";
  const watchCategory = watch("category");
  const watchIconType = watch("iconType");
  const watchIconBg = watch("iconBg");
  const watchIconColor = watch("iconColor");
  const watchBadge = watch("badge") || "";
  const watchIsPinned = watch("isPinned");

  // 아이콘 선택 핸들러
  const handleIconSelect = (option: (typeof ICON_OPTIONS)[0]) => {
    setValue("iconType", option.type, { shouldValidate: true });
    setValue("iconBg", option.defaultBg, { shouldValidate: true });
    setValue("iconColor", option.defaultColor, { shouldValidate: true });
  };

  // 폼 제출
  const onSubmit = (data: AddLinkFormValues) => {
    const finalUrl = normalizeUrl(data.url);

    onAddLink({
      title: data.title.trim(),
      url: finalUrl,
      subtitle: data.subtitle?.trim() || undefined,
      category: data.category,
      iconType: data.iconType,
      iconBg: data.iconBg,
      iconColor: data.iconColor,
      badge: data.badge?.trim() || undefined,
      isPinned: data.isPinned,
      isActive: true,
    });

    reset();
    onOpenChange(false);
  };

  // 닫기 및 초기화
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // 실시간 미리보기 도메인
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

  // 실시간 URL 안내 문구
  const urlGuideText = useMemo(() => {
    const trimmed = watchUrl?.trim();
    if (!trimmed || errors.url) return null;
    if (trimmed.startsWith("mailto:") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return `✉️ 이메일 링크 (${normalizeUrl(trimmed)})로 연결돼요`;
    }
    if (trimmed.startsWith("tel:") || /^(\+?\d{2,4}-?\d{3,4}-?\d{4})$/.test(trimmed)) {
      return `📞 전화 연결 (${normalizeUrl(trimmed)})로 연결돼요`;
    }
    const final = normalizeUrl(trimmed);
    return `🔗 등록 시 ${final} 로 연결돼요`;
  }, [watchUrl, errors.url]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-[#3182F6] text-white flex items-center justify-center">
              <IconPlus className="w-5 h-5" />
            </div>
            <DialogTitle>새 링크 추가</DialogTitle>
          </div>
          <DialogDescription>
            내 프로필에 노출될 새로운 링크 정보를 입력하고 실시간으로 확인해 보세요.
          </DialogDescription>
        </DialogHeader>

        {/* 1. 실시간 미리보기 카드 (PRD 1.4 시나리오 실시간 피드백) */}
        <div className="bg-[#F2F4F6] p-3 rounded-[18px] border border-[#E5E8EB]">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-bold text-[#6B7684] uppercase tracking-wider">
              실시간 미리보기
            </span>
            {watchIsPinned && (
              <Badge variant="brand" size="sm" className="text-[10px] px-1.5 py-0.5 font-bold">
                상단 고정됨
              </Badge>
            )}
          </div>

          <div className="bg-white rounded-[16px] p-3.5 border border-[#E5E8EB] shadow-2xs flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-all shadow-2xs"
              style={{ backgroundColor: watchIconBg, color: watchIconColor }}
            >
              {renderLinkIcon(watchIconType, "w-5 h-5")}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-[#191F28] truncate">
                  {watchTitle?.trim() || "링크 제목 미리보기"}
                </span>
                {watchBadge?.trim() && (
                  <Badge variant="secondary" size="sm" className="font-bold text-[11px]">
                    {watchBadge.trim()}
                  </Badge>
                )}
              </div>
              <p className="text-[12px] text-[#6B7684] truncate">
                {watchSubtitle?.trim() || "보조 설명 문구가 여기에 표시돼요"}
              </p>
              <div className="text-[11px] text-[#8B95A1] flex items-center gap-1 mt-0.5">
                <IconGlobe className="w-3 h-3 text-[#8B95A1]" />
                <span className="truncate">{previewDomain}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 입력 폼 (React Hook Form + Zod) */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
          {/* 링크 제목 입력 및 검증 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B] flex items-center justify-between">
              <span>
                링크 제목 <span className="text-[#F04452]">*</span>
              </span>
              <span
                className={`text-[11px] font-semibold tabular-nums ${
                  (watchTitle?.length || 0) >= 40
                    ? "text-[#F04452]"
                    : (watchTitle?.length || 0) >= 30
                    ? "text-[#EA580C]"
                    : "text-[#8B95A1]"
                }`}
              >
                {watchTitle?.length || 0}/40자
              </span>
            </label>
            <Input
              type="text"
              {...register("title")}
              placeholder="예: 2026 포트폴리오 웹사이트, 신규 굿즈 펀딩"
              isError={!!errors.title}
            />
            {errors.title?.message && (
              <p className="text-[12px] text-[#F04452] font-medium pl-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* 목적지 URL 입력 및 검증 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B] flex items-center justify-between">
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
              placeholder="예: https://my-portfolio.com, github.com/user, name@email.com"
              isError={!!errors.url}
            />
            {/* 에러 메시지 */}
            {errors.url?.message && (
              <p className="text-[12px] text-[#F04452] font-medium pl-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>{errors.url.message}</span>
              </p>
            )}
            {/* 정상 입력 시 연결 안내 가이드 */}
            {!errors.url && urlGuideText && (
              <p className="text-[12px] text-[#059669] font-medium pl-1 truncate">
                {urlGuideText}
              </p>
            )}
          </div>

          {/* 보조 설명 문구 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B] flex items-center justify-between">
              <span>
                보조 설명 문구 <span className="text-[11px] font-normal text-[#8B95A1]">(선택)</span>
              </span>
              <span
                className={`text-[11px] font-semibold tabular-nums ${
                  (watchSubtitle?.length || 0) >= 60 ? "text-[#F04452]" : "text-[#8B95A1]"
                }`}
              >
                {watchSubtitle?.length || 0}/60자
              </span>
            </label>
            <Input
              type="text"
              {...register("subtitle")}
              placeholder="예: 최근 작업물과 프로젝트 상세 소개"
              isError={!!errors.subtitle}
            />
            {errors.subtitle?.message && (
              <p className="text-[12px] text-[#F04452] font-medium pl-1">
                {errors.subtitle.message}
              </p>
            )}
          </div>

          {/* 카테고리 선택 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B]">카테고리</label>
            <div className="flex flex-wrap gap-1.5">
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
                    className={`h-8 px-3 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#191F28] text-white shadow-xs font-bold"
                        : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 대표 아이콘 선택 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B]">대표 아이콘</label>
            <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#F9FAFB] rounded-[14px] border border-[#E5E8EB]">
              {ICON_OPTIONS.map((item) => {
                const isSelected = watchIconType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleIconSelect(item)}
                    className={`flex flex-col items-center justify-center p-2 rounded-[10px] text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white ring-2 ring-[#3182F6] shadow-xs text-[#3182F6]"
                        : "hover:bg-white text-[#4E5968]"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-[8px] flex items-center justify-center mb-1"
                      style={{
                        backgroundColor: isSelected ? item.defaultBg : "#F2F4F6",
                        color: isSelected ? item.defaultColor : "#6B7684",
                      }}
                    >
                      {renderLinkIcon(item.type, "w-4 h-4")}
                    </div>
                    <span className="text-[10px] font-medium truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 아이콘 색상 커스텀 */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#6B7684]">
              아이콘 색상 스타일
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
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
                    title={p.label}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "border-[#3182F6] bg-white text-[#3182F6] ring-1 ring-[#3182F6] font-bold"
                        : "border-[#E5E8EB] bg-[#F9FAFB] text-[#4E5968] hover:bg-white"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 강조 배지 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B] flex items-center justify-between">
              <span>
                강조 배지 <span className="text-[11px] font-normal text-[#8B95A1]">(선택)</span>
              </span>
              <span
                className={`text-[11px] font-semibold tabular-nums ${
                  (watchBadge?.length || 0) >= 15 ? "text-[#F04452]" : "text-[#8B95A1]"
                }`}
              >
                {watchBadge?.length || 0}/15자
              </span>
            </label>
            <Input
              type="text"
              {...register("badge")}
              placeholder="예: 대표 링크, NEW, 1.5k Stars"
              isError={!!errors.badge}
            />
            {errors.badge?.message && (
              <p className="text-[12px] text-[#F04452] font-medium pl-1">
                {errors.badge.message}
              </p>
            )}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              <span className="text-[11px] text-[#8B95A1] shrink-0">추천:</span>
              {QUICK_BADGES.map((qb) => (
                <button
                  key={qb}
                  type="button"
                  onClick={() => setValue("badge", qb, { shouldValidate: true })}
                  className={`px-2 py-0.5 rounded-[6px] text-[11px] transition-all cursor-pointer shrink-0 ${
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
                  className="text-[11px] text-[#8B95A1] hover:text-[#F04452] ml-1 cursor-pointer shrink-0"
                >
                  지우기
                </button>
              )}
            </div>
          </div>

          {/* 상단 고정 체크박스 */}
          <label className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] cursor-pointer hover:bg-[#F2F4F6] transition-colors">
            <input
              type="checkbox"
              {...register("isPinned")}
              className="w-4.5 h-4.5 accent-[#3182F6] rounded-[4px] cursor-pointer"
            />
            <div className="flex-1 text-[13px]">
              <span className="font-bold text-[#191F28]">목록 최상단에 고정 (PIN)</span>
              <p className="text-[11px] text-[#6B7684]">
                프로필 방문자에게 가장 먼저 눈에 띄도록 최우선 배치돼요.
              </p>
            </div>
          </label>

          {/* 제출 & 취소 액션 */}
          <DialogFooter className="pt-2 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="secondary"
              size="default"
              onClick={handleClose}
              className="w-full sm:w-auto cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="default"
              className="w-full sm:flex-1 cursor-pointer shadow-xs gap-1.5"
            >
              <IconPlus className="w-4.5 h-4.5 text-white" />
              <span>링크 추가하기</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
