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
import { IconTrash } from "@/components/icons";

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkTitle: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  linkTitle,
  onConfirm,
  isLoading = false,
}: DeleteLinkDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <DialogContent className="max-w-md p-5 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-full bg-[#FEECEE] text-[#F04452] flex items-center justify-center shrink-0">
              <IconTrash className="w-5 h-5" />
            </div>
            <DialogTitle className="text-[19px] font-bold text-[#191F28]">
              정말 삭제하시겠습니까?
            </DialogTitle>
          </div>
          <DialogDescription className="text-[14px] text-[#4E5968] pt-1">
            <span className="font-semibold text-[#191F28] break-all">
              &quot;{linkTitle}&quot;
            </span>{" "}
            링크를 영구적으로 삭제합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <p className="text-[13px] font-semibold text-[#F04452] flex items-center gap-1.5 bg-[#FEECEE]/60 px-3 py-2.5 rounded-[12px] border border-[#FEECEE]">
            <span>⚠️</span>
            <span>이 작업은 되돌릴 수 없습니다</span>
          </p>
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="secondary"
            size="default"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            size="default"
            disabled={isLoading}
            onClick={handleConfirm}
            className="w-full sm:flex-1 cursor-pointer shadow-xs gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>삭제하는 중...</span>
              </>
            ) : (
              <span>삭제하기</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
