import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Badge 명세 (docs/design.md 기준)
 * - 높이 22px, 반경 6px ({rounded.radius-xs} ~ 6px)
 * - 시맨틱 색상에 매핑된 washed 배경 + 선명한 텍스트
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center font-bold tracking-tight whitespace-nowrap select-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#F2F4F6] text-[#4E5968] border border-[#E5E8EB]",
        secondary:
          "bg-[#F2F4F6] text-[#4E5968] border border-[#E5E8EB]",
        brand:
          "bg-[#E8F3FF] text-[#3182F6]",
        success:
          "bg-[#E6F4EA] text-[#059669]",
        danger:
          "bg-[#FEE2E2] text-[#F04452]",
        warning:
          "bg-[#FEF3C7] text-[#D97706]",
        dark:
          "bg-[#191F28] text-white",
        outline:
          "border border-[#E5E8EB] text-[#4E5968] bg-white",
      },
      size: {
        default: "h-[22px] px-2 rounded-[6px] text-[11px]",
        sm: "h-[18px] px-1.5 rounded-[4px] text-[10px]",
        lg: "h-6 px-2.5 rounded-[8px] text-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
