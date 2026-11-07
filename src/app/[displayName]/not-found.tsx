import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center p-4 text-[#191F28]">
      <div className="max-w-md w-full bg-white rounded-[24px] p-8 sm:p-10 text-center shadow-xs border border-[#E5E8EB] space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#FEEBF0] text-[#F04452] flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#191F28]">
            사용자를 찾을 수 없습니다
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#6B7684] leading-relaxed">
            찾으시는 사용자의 프로필이 존재하지 않거나, username(공유 URL)이 변경되었을 수 있어요.
          </p>
        </div>

        <div className="pt-3">
          <Link href="/">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-full font-bold cursor-pointer"
            >
              MYLINK 홈으로 이동
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
