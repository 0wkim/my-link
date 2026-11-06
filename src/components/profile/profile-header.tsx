"use client";

import React from "react";
import type { UserProfile } from "@/types/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar";
import { IconVerified } from "@/components/icons";

interface ProfileHeaderProps {
  profile?: UserProfile;
  onCopyEmail?: () => void;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  if (!profile) return null;

  return (
    <Card className="rounded-[24px] border-[#E5E8EB]">
      <CardContent className="p-6 sm:p-7">
        {/* 가용 상태 뱃지 (TDS Pill) */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3FF] text-[#3182F6] text-[13px] font-semibold mb-5">
          <span className="w-2 h-2 rounded-full bg-[#3182F6] animate-pulse" />
          <span>새로운 협업 및 프로젝트를 환영해요</span>
        </div>

        {/* 프로필 이미지 & 기본 정보 */}
        <div className="flex items-start gap-4 sm:gap-5">
          <Avatar size="xl">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={`${profile.displayName} 아바타`} />
            ) : (
              <AvatarFallback>{profile.displayName?.[0] || "U"}</AvatarFallback>
            )}
            <AvatarBadge />
          </Avatar>

          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-[22px] sm:text-[24px] font-bold text-[#191F28] tracking-tight leading-tight">
                {profile.displayName}
              </h1>
              <IconVerified className="w-5 h-5 text-[#3182F6] shrink-0" />
            </div>
            <p className="text-[14px] sm:text-[15px] font-medium text-[#4E5968] mb-1">
              @{profile.handle} · {profile.role}
            </p>
            {profile.location && (
              <p className="text-[13px] text-[#8B95A1]">{profile.location}</p>
            )}
          </div>
        </div>

        {/* 소개글 (해요체) */}
        {profile.bio && (
          <p className="text-[15px] sm:text-[16px] text-[#333D4B] leading-relaxed break-keep mt-5">
            {profile.bio}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
