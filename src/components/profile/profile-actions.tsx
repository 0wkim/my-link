"use client";

import React, { useState } from "react";
import type { User } from "firebase/auth";
import { Menu } from "@base-ui/react/menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconPlus,
  IconGoogle,
  IconLogOut,
  IconCopy,
  IconExternalLink,
  IconPalette,
  IconChevronDown,
  IconCheck,
} from "@/components/icons";
import type { ProfileTheme } from "@/types/link";

interface ProfileActionsProps {
  user: User | null;
  isAuthLoading?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenAddLink?: () => void;
  currentTheme?: ProfileTheme["presetId"];
  onSelectTheme?: (theme: ProfileTheme["presetId"]) => void;
  onCopyPageLink?: () => void;
  onPreviewPage?: () => void;
}

const THEME_OPTIONS: Array<{ id: ProfileTheme["presetId"]; name: string; color: string }> = [
  { id: "toss", name: "토스 라이트", color: "#F2F4F6" },
  { id: "minimal", name: "미니멀 화이트", color: "#FFFFFF" },
  { id: "dark", name: "모던 다크", color: "#191F28" },
  { id: "vivid", name: "비비드 블루", color: "#E8F3FF" },
];

export function ProfileActions({
  user,
  isAuthLoading = false,
  onLogin,
  onLogout,
  onOpenAddLink,
  currentTheme = "toss",
  onSelectTheme,
  onCopyPageLink,
  onPreviewPage,
}: ProfileActionsProps) {
  // displayName은 이메일 앞부분 적용
  const userPrefix = user?.email ? user.email.split("@")[0] : (user?.displayName || "사용자");
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);

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

        {/* 우측 조작 액션 (로그인/로그아웃 & Base UI Dropdown Menu & 새 링크) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {user ? (
            <>
              {/* Base UI Menu를 사용한 프로필 드롭다운 */}
              <Menu.Root>
                <Menu.Trigger className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-bold text-[#191F28] bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-full transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]">
                  <span className="max-w-[85px] sm:max-w-[120px] truncate">{userPrefix}님</span>
                  <IconChevronDown className="w-3.5 h-3.5 text-[#6B7684]" />
                </Menu.Trigger>

                <Menu.Portal>
                  <Menu.Positioner sideOffset={8} align="end" className="z-50">
                    <Menu.Popup className="w-56 bg-white rounded-2xl shadow-xl border border-[#E5E8EB] p-1.5 outline-none focus:outline-none transition-all duration-150 animate-in fade-in-0 zoom-in-95">
                      {/* 유저 기본 정보 헤더 */}
                      <div className="px-3 py-2 border-b border-[#F2F4F6] mb-1">
                        <p className="text-[14px] font-bold text-[#191F28] truncate">
                          {userPrefix}
                        </p>
                        <p className="text-[12px] text-[#8B95A1] truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* 1. 내 페이지 미리보기 */}
                      <Menu.Item
                        onClick={onPreviewPage}
                        className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#333D4B] hover:text-[#191F28] hover:bg-[#F2F4F6] rounded-xl cursor-pointer outline-none transition-colors"
                      >
                        <IconExternalLink className="w-4 h-4 text-[#6B7684]" />
                        <span>내 페이지 미리보기</span>
                      </Menu.Item>

                      {/* 2. 내 페이지 링크 복사 */}
                      <Menu.Item
                        onClick={onCopyPageLink}
                        className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#333D4B] hover:text-[#191F28] hover:bg-[#F2F4F6] rounded-xl cursor-pointer outline-none transition-colors"
                      >
                        <IconCopy className="w-4 h-4 text-[#6B7684]" />
                        <span>내 페이지 링크 복사</span>
                      </Menu.Item>

                      {/* 3. 테마 변경 서브 섹션 */}
                      <div className="my-1 border-t border-[#F2F4F6] pt-1">
                        <button
                          type="button"
                          onClick={() => setIsThemeSubmenuOpen((prev) => !prev)}
                          className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium text-[#333D4B] hover:text-[#191F28] hover:bg-[#F2F4F6] rounded-xl cursor-pointer outline-none transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <IconPalette className="w-4 h-4 text-[#6B7684]" />
                            <span>테마 변경</span>
                          </div>
                          <IconChevronDown
                            className={`w-3.5 h-3.5 text-[#8B95A1] transition-transform duration-200 ${
                              isThemeSubmenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isThemeSubmenuOpen && (
                          <div className="pl-4 pr-1 py-1 space-y-0.5">
                            {THEME_OPTIONS.map((theme) => {
                              const isSelected = currentTheme === theme.id;
                              return (
                                <button
                                  key={theme.id}
                                  type="button"
                                  onClick={() => onSelectTheme?.(theme.id)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] rounded-lg cursor-pointer transition-colors ${
                                    isSelected
                                      ? "bg-[#E8F3FF] text-[#3182F6] font-bold"
                                      : "text-[#4E5968] hover:bg-[#F2F4F6]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                                      style={{ backgroundColor: theme.color }}
                                    />
                                    <span>{theme.name}</span>
                                  </div>
                                  {isSelected && <IconCheck className="w-3.5 h-3.5 text-[#3182F6]" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="my-1 border-t border-[#F2F4F6]" />

                      {/* 4. 로그아웃 */}
                      <Menu.Item
                        onClick={onLogout}
                        className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-[#E93D82] hover:bg-[#FEEBF0] rounded-xl cursor-pointer outline-none transition-colors"
                      >
                        <IconLogOut className="w-4 h-4 text-[#E93D82]" />
                        <span>로그아웃</span>
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>

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
            </>
          ) : (
            /* 로그아웃 상태: "Google로 로그인" 버튼 */
            <Button
              variant="outline"
              size="sm"
              onClick={onLogin}
              disabled={isAuthLoading}
              title="Google 계정으로 로그인"
              className="h-8 px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-semibold text-[#333D4B] border-[#D1D6DB] hover:bg-[#F2F4F6] rounded-full gap-1.5 cursor-pointer shadow-2xs"
            >
              <IconGoogle className="w-3.5 h-3.5 shrink-0" />
              <span>Google로 로그인</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
