"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { auth } from "@/lib/firebase";
import { useUserLinksQuery, useUserProfileQuery } from "@/hooks/use-profile-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { IconCursorClick, IconLink } from "@/components/icons";
import { ProfileActions } from "@/components/profile/profile-actions";

const chartConfig = {
  clicks: {
    label: "클릭 수",
    color: "#3182F6",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { data: userProfile } = useUserProfileQuery(user);
  const { data: links = [], isLoading: isLinksLoading } = useUserLinksQuery(user?.uid);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/");
    }
  }, [isAuthLoading, router, user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleGoToPersonalPage = () => {
    const slug = userProfile?.displayName || userProfile?.username || user?.email?.split("@")[0];
    if (slug) {
      router.push(`/${encodeURIComponent(slug)}`);
    }
  };

  const { totalClicks, activeLinks, chartData } = useMemo(() => {
    const sortedLinks = [...links].sort((a, b) => b.clickCount - a.clickCount);

    return {
      totalClicks: links.reduce((total, link) => total + (link.clickCount || 0), 0),
      activeLinks: links.filter((link) => link.isActive).length,
      chartData: sortedLinks.map((link) => ({
        name: link.title,
        clicks: link.clickCount || 0,
      })),
    };
  }, [links]);

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-[#3182F6] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] font-medium text-[#6B7684]">통계 페이지를 확인하고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] pb-16 selection:bg-[#3182F6] selection:text-white">
      <ProfileActions
        user={user}
        userProfile={userProfile}
        onLogout={handleLogout}
        onGoToPersonalPage={handleGoToPersonalPage}
        onGoToStats={() => router.replace("/stats")}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-5 pt-7 space-y-4">
        <section>
          <p className="text-[13px] font-bold text-[#3182F6]">내 링크 성과</p>
          <h1 className="mt-1 text-[26px] sm:text-[30px] font-bold tracking-tight">통계</h1>
          <p className="mt-1.5 text-[14px] sm:text-[15px] text-[#6B7684]">
            링크별 클릭 성과를 한눈에 확인해 보세요.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="rounded-[20px]">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center">
                <IconCursorClick className="w-5 h-5" />
              </div>
              <p className="mt-4 text-[13px] font-medium text-[#6B7684]">총 클릭 수</p>
              <p className="mt-0.5 text-[28px] font-bold tracking-tight tabular-nums">{totalClicks.toLocaleString()}<span className="ml-1 text-[16px] text-[#6B7684]">회</span></p>
              <p className="mt-1 text-[12px] text-[#8B95A1]">모든 링크의 클릭 수를 합산했어요</p>
            </CardContent>
          </Card>
          <Card className="rounded-[20px]">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-xl bg-[#F2F4F6] text-[#4E5968] flex items-center justify-center">
                <IconLink className="w-5 h-5" />
              </div>
              <p className="mt-4 text-[13px] font-medium text-[#6B7684]">활성 링크</p>
              <p className="mt-0.5 text-[28px] font-bold tracking-tight tabular-nums">{activeLinks.toLocaleString()}<span className="ml-1 text-[16px] text-[#6B7684]">개</span></p>
              <p className="mt-1 text-[12px] text-[#8B95A1]">현재 공개되어 있는 링크 수예요</p>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-[24px]">
          <CardHeader className="p-5 sm:p-6 pb-1">
            <CardTitle>링크별 클릭 수</CardTitle>
            <CardDescription>클릭 수가 높은 순으로 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-2">
            {isLinksLoading ? (
              <div className="h-[260px] animate-pulse rounded-xl bg-[#F2F4F6]" />
            ) : chartData.length === 0 ? (
              <div className="h-[260px] flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#F2F4F6] text-[#8B95A1] flex items-center justify-center"><IconLink className="w-5 h-5" /></div>
                <p className="mt-3 text-[14px] font-semibold text-[#4E5968]">아직 등록된 링크가 없어요</p>
                <p className="mt-1 text-[13px] text-[#8B95A1]">링크를 등록하면 클릭 통계를 확인할 수 있어요.</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[260px]">
                <BarChart data={chartData} margin={{ top: 12, right: 8, left: -16, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="#E5E8EB" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} interval={0} tickFormatter={(value) => String(value).length > 9 ? `${String(value).slice(0, 9)}…` : value} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={36} />
                  <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[8, 8, 2, 2]} maxBarSize={52} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
