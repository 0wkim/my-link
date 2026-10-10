import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Button 명세 (docs/design.md 기준)
 * - 사이즈 4단: XL(56px, r16, 17B), L(48px, r14, 17B), M(40px, r12, 15SB), S(32px, r10, 13SB)
 * - variants: primary(blue-500), secondary(grey-100/grey-900), danger(red-500), ghost(blue-500 text), dark(grey-900)
 * - pressed: 검정 26% overlay 피드백
 * - disabled: disabled-opacity 0.30 적용
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-30 active:brightness-90 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[#3182F6] text-white hover:bg-[#1B64DA] active:bg-[#1453B8] shadow-2xs font-bold",
        secondary:
          "bg-[#F2F4F6] text-[#191F28] hover:bg-[#E5E8EB] active:bg-[#D1D6DB] font-semibold",
        danger:
          "bg-[#F04452] text-white hover:bg-[#D93441] active:bg-[#BF2633] font-bold shadow-2xs",
        ghost:
          "bg-transparent text-[#3182F6] hover:bg-[#E8F3FF] active:bg-[#D0E6FF] font-semibold",
        dark:
          "bg-[#191F28] text-white hover:bg-[#333D4B] active:bg-[#4E5968] font-bold shadow-2xs",
        outline:
          "border border-[#E5E8EB] bg-white text-[#191F28] hover:bg-[#F2F4F6] hover:border-[#D1D6DB] active:bg-[#E5E8EB] font-semibold",
        link:
          "text-[#3182F6] underline-offset-4 hover:underline p-0 h-auto font-medium",
        default:
          "bg-[#3182F6] text-white hover:bg-[#1B64DA] active:bg-[#1453B8] shadow-2xs font-bold",
      },
      size: {
        xl: "h-14 px-6 text-[17px] font-bold rounded-[16px] gap-2.5", // 56px, radius 16px, 17px Bold
        l: "h-12 px-5 text-[17px] font-bold rounded-[14px] gap-2",   // 48px, radius 14px, 17px Bold
        m: "h-10 px-4 text-[15px] font-semibold rounded-[12px] gap-2", // 40px, radius 12px, 15px Semibold
        s: "h-8 px-3 text-[13px] font-semibold rounded-[10px] gap-1.5", // 32px, radius 10px, 13px Semibold
        default: "h-12 px-5 text-[17px] font-bold rounded-[14px] gap-2",
        sm: "h-8 px-3 text-[13px] font-semibold rounded-[10px] gap-1.5",
        lg: "h-14 px-6 text-[17px] font-bold rounded-[16px] gap-2.5",
        icon: "size-10 rounded-full p-2.5",
        "icon-sm": "size-8 rounded-full p-1.5",
        "icon-xs": "size-7 rounded-full p-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "l",
    },
  }
);

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant = "primary",
  size = "l",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
