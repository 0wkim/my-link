"use client";

import React from "react";
import type { UserProfile } from "@/types/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  IconVerified,
  IconMail,
  IconGitHub,
  IconLinkedIn,
  IconYouTube,
  IconTwitter,
  IconInstagram,
  IconEye,
} from "@/components/icons";

interface ProfileHeaderProps {
  profile?: UserProfile;
  onCopyEmail: () => void;
}

export function ProfileHeader({ profile, onCopyEmail }: ProfileHeaderProps) {
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
        <div className="flex items-start gap-4 sm:gap-5 mb-5">
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
        <p className="text-[15px] sm:text-[16px] text-[#333D4B] leading-relaxed break-keep mb-5">
          {profile.bio}
        </p>

        {/* 소셜 퀵링크 바 & 통계 조회수 */}
        <div className="flex items-center flex-wrap gap-2 pt-4 border-t border-[#E5E8EB]">
          {profile.email && (
            <Button
              variant="secondary"
              size="s"
              onClick={onCopyEmail}
              className="h-8 px-3 text-[13px] font-medium text-[#333D4B] hover:text-[#191F28] hover:bg-[#E5E8EB] gap-1.5 cursor-pointer rounded-full"
              title={`${profile.email} 복사하기`}
            >
              <IconMail className="w-3.5 h-3.5 text-[#4E5968]" />
              <span>이메일 복사</span>
            </Button>
          )}

          {profile.socials?.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#191F28] transition-colors"
              title="GitHub"
            >
              <IconGitHub className="w-4 h-4" />
            </a>
          )}

          {profile.socials?.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#0284C7] transition-colors"
              title="LinkedIn"
            >
              <IconLinkedIn className="w-4 h-4" />
            </a>
          )}

          {profile.socials?.youtube && (
            <a
              href={profile.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#DC2626] transition-colors"
              title="YouTube"
            >
              <IconYouTube className="w-4 h-4" />
            </a>
          )}

          {profile.socials?.twitter && (
            <a
              href={profile.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#191F28] transition-colors"
              title="Twitter/X"
            >
              <IconTwitter className="w-4 h-4" />
            </a>
          )}

          {profile.socials?.instagram && (
            <a
              href={profile.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#DB2777] transition-colors"
              title="Instagram"
            >
              <IconInstagram className="w-4 h-4" />
            </a>
          )}

          {/* 누적 조회수 지표 */}
          <div className="ml-auto flex items-center gap-2 text-[12px] text-[#8B95A1] tabular-nums">
            <span className="flex items-center gap-1 font-medium">
              <IconEye className="w-3.5 h-3.5" />
              {(profile.viewsCount || 0).toLocaleString()}회 조회
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
