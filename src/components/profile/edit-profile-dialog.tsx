"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkUsernameAvailable } from "@/lib/firestore-profile";
import type { UserProfileData } from "@/types/link";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfileData | null;
  userId: string;
  onSave: (data: {
    username: string;
    displayName: string;
    bio: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  userId,
  onSave,
  isLoading = false,
}: EditProfileDialogProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // 다이얼로그 열릴 때 초기값 세팅
  useEffect(() => {
    if (open && profile) {
      setUsername(profile.username || "");
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setUsernameError(null);
      setDisplayNameError(null);
    }
  }, [open, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase();
    const cleanDisplayName = displayName.trim();
    const cleanBio = bio.trim();

    setUsernameError(null);
    setDisplayNameError(null);

    // 1. 필수값 유효성 검사
    if (!cleanUsername) {
      setUsernameError("공유 URL용 username을 입력해 주세요.");
      return;
    }

    if (!/^[a-z0-9_-]{2,30}$/.test(cleanUsername)) {
      setUsernameError(
        "username은 2~30자의 영문 소문자, 숫자, 밑줄(_), 하이픈(-)만 사용 가능해요."
      );
      return;
    }

    if (!cleanDisplayName) {
      setDisplayNameError("표시 이름(displayName)을 입력해 주세요.");
      return;
    }

    if (cleanDisplayName.length > 40) {
      setDisplayNameError("표시 이름은 최대 40자까지 입력 가능해요.");
      return;
    }

    // 2. 변경 사항 검사 (만약 변경 사항이 없다면 업데이트 하지 않음)
    const initialUsername = (profile?.username || "").trim().toLowerCase();
    const initialDisplayName = (profile?.displayName || "").trim();
    const initialBio = (profile?.bio || "").trim();

    const isUnchanged =
      cleanUsername === initialUsername &&
      cleanDisplayName === initialDisplayName &&
      cleanBio === initialBio;

    if (isUnchanged) {
      toast.info("변경된 내용이 없습니다.");
      onOpenChange(false);
      return;
    }

    // 3. username이 변경되었을 경우 중복 체크
    if (cleanUsername !== initialUsername) {
      setIsCheckingDuplicate(true);
      try {
        const isAvailable = await checkUsernameAvailable(cleanUsername, userId);
        if (!isAvailable) {
          setUsernameError("이미 다른 사용자가 사용 중인 username입니다.");
          toast.error("이미 사용 중인 username입니다. 다른 이름을 입력해 주세요.");
          setIsCheckingDuplicate(false);
          return;
        }
      } catch (err) {
        console.error("중복 확인 오류:", err);
      } finally {
        setIsCheckingDuplicate(false);
      }
    }

    // 4. 저장 수행
    try {
      await onSave({
        username: cleanUsername,
        displayName: cleanDisplayName,
        bio: cleanBio,
      });
      toast.success("프로필을 성공적으로 수정했어요!");
      onOpenChange(false);
    } catch (error: any) {
      console.error("프로필 수정 실패:", error);
      const msg = error?.message || "프로필 저장 중 오류가 발생했습니다.";
      if (msg.includes("username")) {
        setUsernameError(msg);
      }
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            내 프로필 정보와 공유 URL용 고유 username을 수정할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* 1. username 필드 (공유 URL용) */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B] flex items-center justify-between">
              <span>username (공유 URL용)</span>
              <span className="text-[11px] font-normal text-[#8B95A1]">
                영문 소문자, 숫자, -, _
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B95A1] text-[15px] font-semibold select-none">
                @
              </span>
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase());
                  if (usernameError) setUsernameError(null);
                }}
                placeholder="hong"
                className="pl-8"
                isError={!!usernameError}
                disabled={isLoading || isCheckingDuplicate}
                maxLength={30}
              />
            </div>
            {usernameError ? (
              <p className="text-[12px] font-medium text-[#F04452]">{usernameError}</p>
            ) : (
              <p className="text-[11px] text-[#8B95A1]">
                개인 링크 주소: <span className="font-mono text-[#3182F6]">/{username || "..."}</span>
              </p>
            )}
          </div>

          {/* 2. displayName 필드 (표시 이름) */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#333D4B]">
              표시 이름 (displayName)
            </label>
            <Input
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (displayNameError) setDisplayNameError(null);
              }}
              placeholder="홍길동"
              isError={!!displayNameError}
              disabled={isLoading || isCheckingDuplicate}
              maxLength={40}
            />
            {displayNameError && (
              <p className="text-[12px] font-medium text-[#F04452]">{displayNameError}</p>
            )}
          </div>

          {/* 3. bio 필드 (소개글) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#333D4B]">
                소개글 (bio)
              </label>
              <span className="text-[11px] text-[#8B95A1]">{bio.length}/200자</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="나를 표현하는 한마디나 소개글을 적어주세요."
              rows={3}
              maxLength={200}
              disabled={isLoading || isCheckingDuplicate}
              className="w-full px-4 py-3 rounded-[12px] text-[14px] leading-relaxed transition-all outline-none resize-none bg-[#F2F4F6] text-[#191F28] placeholder-[#8B95A1] border border-[#E5E8EB] focus:bg-white focus:border-[#3182F6] focus:border-[1.5px] focus:shadow-xs disabled:cursor-not-allowed disabled:opacity-30"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || isCheckingDuplicate}
              className="cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || isCheckingDuplicate}
              className="cursor-pointer min-w-[80px]"
            >
              {isLoading || isCheckingDuplicate ? "확인 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
