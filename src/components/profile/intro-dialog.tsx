"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconSparkles } from "@/components/icons";

interface IntroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IntroDialog({ open, onOpenChange }: IntroDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="w-12 h-12 rounded-[16px] bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center">
          <IconSparkles className="w-6 h-6" />
        </div>

        <DialogHeader>
          <DialogTitle>마이링크 (MyLink) MVP 안내</DialogTitle>
          <DialogDescription>
            현재 버전(Phase 1)은 <strong>로컬 스토리지(LocalStorage)</strong>와{" "}
            <strong>Zustand persist</strong>를 기반으로 완전히 동작하는 링크 목록 뷰어입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-[#F2F4F6] rounded-[16px] p-4 text-[13px] text-[#333D4B] space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3182F6] shrink-0" />
            <span>
              기본 시드 계정: <strong>@hong</strong> (개발자), <strong>@sujin</strong> (창작자)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3182F6] shrink-0" />
            <span>링크 클릭 시 로컬 누적 클릭수와 Mock API가 자동 연동돼요.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3182F6] shrink-0" />
            <span>차기 마일스톤(Phase 2)에서 실시간 드래그 편집 에디터가 지원됩니다.</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="primary"
            size="l"
            onClick={() => onOpenChange(false)}
            className="w-full cursor-pointer"
          >
            확인했어요
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
