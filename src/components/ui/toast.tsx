import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCheck } from "@/components/icons";

export interface ToastProps extends React.ComponentProps<"div"> {
  message: string | null;
  icon?: React.ReactNode;
}

/**
 * 토스 디자인 시스템(TDS) Toast 명세 (docs/design.md 기준)
 * - fill-primary (grey-900 / #191F28) 표면 + 흰 라벨
 * - radius-l: 14px (rounded-[14px])
 * - elevation: shadow-toast (tds-shadow-toast)
 * - 성공 아이콘: 20px green-500 (#059669) 원 + 흰 체크
 */
export function Toast({ message, icon, className, ...props }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
    >
      <div
        className={cn(
          "bg-[#191F28] text-white text-[15px] font-medium px-5 py-3 rounded-[14px] tds-shadow-toast flex items-center gap-2.5 shadow-lg select-none",
          className
        )}
        {...props}
      >
        {icon || (
          <span className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center shrink-0">
            <IconCheck className="w-3.5 h-3.5 text-white" />
          </span>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
