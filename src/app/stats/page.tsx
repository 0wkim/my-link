import type { Metadata } from "next";
import StatsPage from "@/components/stats-page";

export const metadata: Metadata = {
  title: "통계 | MYLINK",
  description: "내 링크의 클릭 통계를 확인하세요.",
};

export default function Stats() {
  return <StatsPage />;
}
