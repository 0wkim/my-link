import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) text-field 명세 (docs/design.md 기준)
 * - 48px height (h-12)
 * - radius-m: 12px (rounded-[12px])
 * - resting: fill-secondary (#F2F4F6) 배경 + 1px border-secondary (#E5E8EB) 보더
 * - focus: 흰 배경 (bg-white) + 1.5px border-primary (#3182F6) 보더
 * - error: 1.5px fill-danger (#F04452) 보더
 */
export type InputProps = React.ComponentProps<"input"> & {
  isError?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full h-12 px-4 rounded-[12px] text-[15px] font-normal transition-all outline-none",
          "bg-[#F2F4F6] text-[#191F28] placeholder-[#8B95A1] border border-[#E5E8EB]",
          "focus:bg-white focus:border-[#3182F6] focus:border-[1.5px] focus:shadow-xs",
          isError && "border-[#F04452] border-[1.5px] focus:border-[#F04452]",
          "disabled:cursor-not-allowed disabled:opacity-30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
