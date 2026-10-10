import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<"div"> {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-10 h-10 text-[14px]",
  md: "w-12 h-12 text-[16px]",
  lg: "w-16 h-16 text-[20px]",
  xl: "w-20 h-20 sm:w-22 sm:h-22 text-[26px]",
};

function Avatar({ className, size = "md", ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative rounded-full overflow-hidden bg-[#F2F4F6] shrink-0 border-2 border-white shadow-xs ring-1 ring-[#E5E8EB]",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

interface AvatarImageProps extends Omit<React.ComponentProps<typeof Image>, "alt"> {
  alt: string;
}

function AvatarImage({ className, alt, unoptimized = true, ...props }: AvatarImageProps) {
  return (
    <Image
      data-slot="avatar-image"
      alt={alt}
      fill
      sizes="88px"
      unoptimized={unoptimized}
      className={cn("object-cover object-top", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "w-full h-full flex items-center justify-center font-bold text-[#8B95A1] bg-[#F2F4F6] select-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#059669] ring-2 ring-white z-10",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge };
