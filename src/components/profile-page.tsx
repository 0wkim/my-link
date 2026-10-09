"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  IconGitHub,
  IconLinkedIn,
  IconTwitter,
  IconMail,
  IconExternalLink,
  IconArrowUpRight,
  IconCopy,
  IconCheck,
  IconHeart,
  IconShare,
  IconSparkles,
  IconMapPin,
  IconBriefcase,
  IconCode,
  IconFileText,
  IconCoffee,
  IconGlobe,
  IconBadgeCheck,
} from "./icons";

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

interface BioLink {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  url: string;
  icon: React.ReactNode;
}

const PROJECTS: Project[] = [
  {
    id: "lumina-canvas",
    title: "Lumina Canvas",
    tagline: "차세대 노드 기반 AI 디자인 스튜디오",
    description:
      "생성형 AI 워크플로우를 직관적인 무한 캔버스로 연결하여 실시간으로 고화질 그래픽과 콘셉트 아트를 생성하는 웹 플랫폼입니다.",
    badge: "AI Studio",
    image: "/images/project-ai-canvas.jpg",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Canvas API"],
    demoUrl: "https://example.com/lumina",
    githubUrl: "https://github.com/example/lumina-canvas",
  },
  {
    id: "nexus-analytics",
    title: "Nexus Analytics",
    tagline: "실시간 비즈니스 인텔리전스 SaaS 대시보드",
    description:
      "대규모 트래픽과 사용자 행동 데이터를 매끄러운 반응형 차트와 통계 위젯으로 시각화하여 비즈니스 의사결정을 돕는 대시보드입니다.",
    badge: "SaaS Dashboard",
    image: "/images/project-dashboard.jpg",
    tags: ["Next.js 16", "Turbopack", "Recharts", "Tailwind CSS", "Supabase"],
    demoUrl: "https://example.com/nexus",
    githubUrl: "https://github.com/example/nexus-analytics",
  },
];

const BIO_LINKS: BioLink[] = [
  {
    id: "portfolio",
    title: "2026 포트폴리오 웹사이트",
    subtitle: "인터랙티브 3D 쇼케이스 및 상세 프로젝트 스토리",
    badge: "Featured",
    url: "https://example.com/portfolio",
    icon: <IconGlobe className="w-5 h-5 text-indigo-500" />,
  },
  {
    id: "blog",
    title: "기술 블로그 (Tech Insights)",
    subtitle: "웹 프론트엔드 최적화와 디자인 시스템에 관한 이야기",
    badge: "Weekly",
    url: "https://example.com/blog",
    icon: <IconSparkles className="w-5 h-5 text-amber-500" />,
  },
  {
    id: "github",
    title: "GitHub 오픈소스 프로젝트",
    subtitle: "1.5k+ Stars를 획득한 다양한 UI 라이브러리와 실험작들",
    badge: "Open Source",
    url: "https://github.com",
    icon: <IconGitHub className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  },
  {
    id: "resume",
    title: "이력서 및 경력기술서 다운로드",
    subtitle: "상세 업무 경험, 프로젝트 성과 및 기술 역량 (PDF)",
    badge: "PDF",
    url: "#resume",
    icon: <IconFileText className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "coffee-chat",
    title: "1:1 커피챗 & 멘토링 신청",
    subtitle: "커리어 고민, 협업 제안, 커피 한 잔과 함께 편하게 이야기해요",
    badge: "30min",
    url: "mailto:hong.gildong@example.com?subject=커피챗 문의",
    icon: <IconCoffee className="w-5 h-5 text-orange-500" />,
  },
];

const TECH_STACK = [
  { category: "Frontend", items: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS v4", "HTML5 / CSS3", "Framer Motion"] },
  { category: "State & Data", items: ["Zustand", "TanStack Query", "Turbopack", "REST / GraphQL"] },
  { category: "Backend & Cloud", items: ["Node.js", "Supabase", "PostgreSQL", "Vercel"] },
  { category: "Design & Tools", items: ["Figma", "Git / GitHub", "VS Code", "Responsive Web Design"] },
];

const TIMELINE = [
  {
    period: "2024.03 ~ 현재",
    role: "Senior Frontend Engineer",
    company: "테크 이노베이션즈 (Tech Innovations)",
    description: "핵심 웹 프로덕트 프론트엔드 아키텍처 리드 및 대규모 컴포넌트 디자인 시스템 구축",
  },
  {
    period: "2022.02 ~ 2024.02",
    role: "Frontend Developer",
    company: "스튜디오 넥서스 (Studio Nexus)",
    description: "SaaS 플랫폼 프론트엔드 개발, 웹 성능 지표(LCP, FID) 45% 개선",
  },
  {
    period: "2020.03 ~ 2022.01",
    role: "Junior Web Developer",
    company: "디지털 에이전시 (Digital Wave)",
    description: "다양한 브랜드의 반응형 인터랙티브 웹사이트 및 프로모션 페이지 구축",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"all" | "links" | "projects" | "about">("all");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(128);
  const [isLiked, setIsLiked] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hong.gildong@example.com");
      setCopiedEmail(true);
      showToast("이메일 주소가 클립보드에 복사되었습니다! ✨");
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      showToast("이메일: hong.gildong@example.com");
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "홍길동 | Frontend Engineer 프로필",
          text: "프론트엔드 개발자 홍길동의 프로필과 프로젝트를 확인해보세요!",
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        showToast("프로필 링크가 복사되었습니다! 🔗");
      }
    }
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
      showToast("응원해주셔서 감사합니다! ❤️");
    } else {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* 배경 은은한 앰비언트 글로우 이펙트 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-gradient-to-br from-cyan-500/10 to-blue-500/15 blur-[140px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 blur-[130px] rounded-full" />
      </div>

      {/* 토스트 알림창 */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-zinc-900/90 dark:bg-zinc-100/95 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/10 dark:border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* 메인 컨테이너 (반응형: 모바일은 싱글 컬럼, 태블릿/데스크톱은 확장된 카드 레이아웃) */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* 상단 퀵 네비게이션 바 */}
        <header className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          {/* 가용 상태 뱃지 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>프로젝트 참여 가능 (Open to Work)</span>
          </div>

          {/* 우측 상단 유틸리티 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                isLiked
                  ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25 scale-105"
                  : "bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-rose-400 hover:text-rose-500"
              }`}
              title="응원하기"
            >
              <IconHeart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              type="button"
              className="p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 transition-colors shadow-sm"
              title="프로필 공유하기"
            >
              <IconShare className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 프로필 메인 카드 (Hero Card) */}
        <section className="relative bg-white/80 dark:bg-zinc-900/75 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-xl shadow-zinc-950/5 dark:shadow-none mb-8 sm:mb-10">
          {/* 커버 배너 이미지 */}
          <div className="relative w-full h-44 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-zinc-900">
            <Image
              src="/images/cover.jpg"
              alt="Profile Cover Banner"
              fill
              priority
              className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* 배너 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-md border border-white/15">
                <IconSparkles className="w-3.5 h-3.5 text-amber-300" />
                Frontend Craftsman
              </span>
            </div>
          </div>

          {/* 프로필 정보 컨테이너 */}
          <div className="relative px-5 sm:px-8 pb-8 pt-0">
            {/* 아바타 이미지 & 퀵 액션 */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              <div className="relative inline-block">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-zinc-900 shadow-2xl bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src="/images/avatar.jpg"
                    alt="홍길동 프로필 사진"
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    priority
                    className="object-cover object-top"
                  />
                </div>
                {/* 온라인 활성 점 표시 */}
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white dark:border-zinc-900 shadow-md"
                  title="현재 온라인"
                />
              </div>

              {/* 상단 액션 버튼 그룹 */}
              <div className="flex flex-wrap items-center gap-2.5 sm:mb-2">
                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md shadow-zinc-950/10 dark:shadow-none transition-all active:scale-95"
                >
                  {copiedEmail ? (
                    <>
                      <IconCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                      <span>복사완료!</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-4 h-4" />
                      <span>이메일 복사</span>
                    </>
                  )}
                </button>

                <a
                  href="mailto:hong.gildong@example.com?subject=프로젝트 문의"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <IconMail className="w-4 h-4" />
                  <span>연락하기</span>
                </a>
              </div>
            </div>

            {/* 이름 및 타이틀 */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  홍길동
                </h1>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  (Alex Hong)
                </span>
                <span className="text-blue-500 dark:text-blue-400" title="공식 인증 프로필">
                  <IconBadgeCheck className="w-5 h-5 fill-current" />
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Senior Frontend Engineer & Product Craftsman
              </p>
            </div>

            {/* 메타 태그 (위치, 경력, 전문분야) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-5">
              <div className="flex items-center gap-1.5">
                <IconMapPin className="w-4 h-4 text-rose-500" />
                <span>대한민국 서울 (Seoul, KR)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconBriefcase className="w-4 h-4 text-indigo-500" />
                <span>5년차 웹 엔지니어</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconCode className="w-4 h-4 text-emerald-500" />
                <span>Next.js 16 · React 19 · TS</span>
              </div>
            </div>

            {/* 소개글 */}
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed break-keep max-w-2xl mb-6">
              복잡하고 거친 기술적 요구사항을 사용자가 직관적으로 체감할 수 있는 유려한 인터페이스로 변환하는 것을 좋아합니다.
              성능 최적화, 컴포넌트 주도 개발, 그리고 세심한 마이크로 인터랙션을 설계하는 일에 몰입합니다.
            </p>

            {/* 소셜 링크 아이콘 바 */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
                채널:
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all hover:-translate-y-0.5"
                title="GitHub"
              >
                <IconGitHub className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all hover:-translate-y-0.5"
                title="LinkedIn"
              >
                <IconLinkedIn className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all hover:-translate-y-0.5"
                title="Twitter / X"
              >
                <IconTwitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:hong.gildong@example.com"
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all hover:-translate-y-0.5"
                title="이메일 보내기"
              >
                <IconMail className="w-4 h-4" />
              </a>
              <a
                href="https://example.com/blog"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all hover:-translate-y-0.5"
                title="기술 블로그"
              >
                <IconGlobe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 핵심 통계 하이라이트 (반응형 3분할 카드) */}
        <section className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 sm:p-5 text-center hover:border-indigo-400/50 transition-colors">
            <span className="block text-xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              5+ 년
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              실무 개발 경력
            </span>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 sm:p-5 text-center hover:border-purple-400/50 transition-colors">
            <span className="block text-xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              30+ 개
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              완료 프로젝트
            </span>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 sm:p-5 text-center hover:border-pink-400/50 transition-colors">
            <span className="block text-xl sm:text-3xl font-extrabold text-pink-600 dark:text-pink-400">
              1.5k+
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              GitHub Stars
            </span>
          </div>
        </section>

        {/* 탭 네비게이션 컨트롤러 */}
        <section className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 mb-8 pb-1">
          <button
            onClick={() => setActiveTab("all")}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md shadow-zinc-950/10"
                : "bg-white/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            ✨ 전체 보기
          </button>
          <button
            onClick={() => setActiveTab("links")}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "links"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md shadow-zinc-950/10"
                : "bg-white/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            🔗 주요 링크 ({BIO_LINKS.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "projects"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md shadow-zinc-950/10"
                : "bg-white/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            💻 대표 프로젝트 ({PROJECTS.length})
          </button>
          <button
            onClick={() => setActiveTab("about")}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "about"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md shadow-zinc-950/10"
                : "bg-white/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            🛠️ 스킬 & 이력
          </button>
        </section>

        {/* 주요 링크 섹션 (Links) */}
        {(activeTab === "all" || activeTab === "links") && (
          <section className="mb-10 sm:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                주요 링크 (Featured Links)
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">클릭하여 바로가기</span>
            </div>

            <div className="flex flex-col gap-3">
              {BIO_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                  className="group relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      {link.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {link.title}
                        </h3>
                        {link.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pl-2">
                    <IconArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 대표 프로젝트 섹션 (Projects with Images) */}
        {(activeTab === "all" || activeTab === "projects") && (
          <section className="mb-10 sm:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                대표 프로젝트 (Featured Projects)
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">직접 제작한 프로덕트</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="group flex flex-col rounded-3xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden hover:border-purple-500/50 dark:hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                >
                  {/* 프로젝트 프리뷰 이미지 */}
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-zinc-950">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {project.badge}
                      </span>
                    </div>
                  </div>

                  {/* 프로젝트 상세 정보 */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
                        {project.tagline}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 break-keep">
                        {project.description}
                      </p>

                      {/* 기술 태그 */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 프로젝트 링크 버튼 */}
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                      >
                        <IconExternalLink className="w-3.5 h-3.5" />
                        <span>라이브 데모</span>
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <IconGitHub className="w-3.5 h-3.5" />
                        <span>코드 저장소</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 기술 스택 & 이력 섹션 (About & Stack) */}
        {(activeTab === "all" || activeTab === "about") && (
          <section className="space-y-8 sm:space-y-10 mb-10 sm:mb-12">
            {/* 기술 스택 카드 */}
            <div className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-7">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                기술 스택 (Tech Stack & Expertise)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TECH_STACK.map((group) => (
                  <div
                    key={group.category}
                    className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60"
                  >
                    <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 경력 타임라인 카드 */}
            <div className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-7">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                주요 경험 및 이력 (Experience Timeline)
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                {TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-500 group-hover:scale-125 transition-transform" />
                    <div>
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mb-1">
                        {item.period}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {item.role} · <span className="font-semibold text-zinc-600 dark:text-zinc-400">{item.company}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 하단 CTA & 연락처 배너 */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10 mb-12">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-2">
                💬 함께 일해볼까요?
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                새로운 아이디어와 프로젝트를 준비 중이신가요?
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-md">
                스타트업 MVP 제작부터 엔터프라이즈 프론트엔드 아키텍처까지 편하게 이야기 나눠요.
              </p>
            </div>
            <a
              href="mailto:hong.gildong@example.com?subject=협업 제안"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 text-xs sm:text-sm font-bold hover:bg-zinc-100 transition-colors shadow-lg active:scale-95 whitespace-nowrap"
            >
              <IconMail className="w-4 h-4 text-indigo-600" />
              <span>메일로 협업 제안하기</span>
            </a>
          </div>
          {/* 장식용 글로우 */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </section>

        {/* 푸터 */}
        <footer className="text-center text-xs text-zinc-500 dark:text-zinc-500 py-6 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <p>© 2026 홍길동 (Alex Hong). All rights reserved.</p>
          <p className="mt-1">
            Built with Next.js 16, React 19 & Tailwind CSS v4 · Fully Responsive
          </p>
        </footer>
      </div>
    </div>
  );
}
