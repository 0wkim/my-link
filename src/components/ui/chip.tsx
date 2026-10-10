import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Chip 명세 (docs/design.md 기준)
 * - 34px 높이의 full pill ({rounded.radius-full})
 * - resting: 1px grey-200 border + 흰 배경 + grey-700 텍스트
 * - active: grey-900 배경 + 흰 텍스트
 * - brand: blue-50 배경 + blue-500 텍스트
 */
const chipVariants = cva(
  "inline-flex items-center justify-center h-[34px] px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all select-none cursor-pointer outline-none",
  {
    variants: {
      variant: {
        resting:
          "bg-white text-[#4E5968] border border-[#E5E8EB] hover:bg-[#F2F4F6] active:bg-[#E5E8EB]",
        active:
          "bg-[#191F28] text-white shadow-2xs",
        brand:
          "bg-[#E8F3FF] text-[#3182F6] hover:bg-[#D4E8FF] active:bg-[#BEDCFF]",
      },
    },
    defaultVariants: {
      variant: "resting",
    },
  }
);

export interface ChipProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof chipVariants> {
  isActive?: boolean;
}

function Chip({ className, variant, isActive, ...props }: ChipProps) {
  const computedVariant = isActive ? "active" : variant;
  return (
    <button
      type="button"
      data-slot="chip"
      className={cn(chipVariants({ variant: computedVariant }), className)}
      {...props}
    />
  );
}

export { Chip, chipVariants };
