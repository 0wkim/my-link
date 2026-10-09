"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  IconChevronRight,
  IconCheck,
  IconShare,
  IconCopy,
  IconMail,
  IconGitHub,
  IconGlobe,
  IconFileText,
  IconCoffee,
  IconExternalLink,
  IconSparkles,
  IconCode,
  IconBriefcase,
} from "./icons";

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

interface BioLinkItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  url: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "lumina-canvas",
    title: "Lumina Canvas",
    subtitle: "AI 디자인 스튜디오",
    description:
      "생성형 AI 워크플로우를 무한 캔버스 노드로 연결하여 그래픽과 목업을 실시간으로 만들어요.",
    image: "/images/project-ai-canvas.jpg",
    badge: "AI 제품",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://example.com/lumina",
    githubUrl: "https://github.com/example/lumina-canvas",
  },
  {
    id: "nexus-analytics",
    title: "Nexus Analytics",
    subtitle: "비즈니스 인텔리전스 대시보드",
    description:
      "대규모 트래픽과 사용자 지표를 고성능 반응형 차트와 통계 위젯으로 시각화해요.",
    image: "/images/project-dashboard.jpg",
    badge: "SaaS 대시보드",
    tags: ["Next.js 16", "Turbopack", "Recharts", "Supabase"],
    demoUrl: "https://example.com/nexus",
    githubUrl: "https://github.com/example/nexus-analytics",
  },
];

const BIO_LINKS: BioLinkItem[] = [
  {
    id: "portfolio",
    title: "2026 포트폴리오 웹사이트",
    subtitle: "인터랙티브 쇼케이스와 프로젝트 상세 이야기",
    badge: "대표 링크",
    url: "https://example.com/portfolio",
    iconBg: "bg-[#E8F3FF]",
    iconColor: "text-[#3182F6]",
    icon: <IconGlobe className="w-5 h-5" />,
  },
  {
    id: "blog",
    title: "기술 블로그",
    subtitle: "웹 프론트엔드 성능 최적화와 디자인 시스템 이야기",
    badge: "매주 업데이트",
    url: "https://example.com/blog",
    iconBg: "bg-[#FFF8E6]",
    iconColor: "text-[#D97706]",
    icon: <IconSparkles className="w-5 h-5" />,
  },
  {
    id: "github",
    title: "GitHub 오픈소스 저장소",
    subtitle: "1,500명 이상이 별을 준 UI 컴포넌트 라이브러리",
    badge: "1.5k Stars",
    url: "https://github.com",
    iconBg: "bg-[#F2F4F6]",
    iconColor: "text-[#191F28]",
    icon: <IconGitHub className="w-5 h-5" />,
  },
  {
    id: "resume",
    title: "이력서 및 경력기술서",
    subtitle: "프로젝트 성과와 기술 역량이 담긴 PDF 문서",
    badge: "PDF",
    url: "#resume",
    iconBg: "bg-[#E6F4EA]",
    iconColor: "text-[#059669]",
    icon: <IconFileText className="w-5 h-5" />,
  },
  {
    id: "coffee-chat",
    title: "1:1 커피챗 신청하기",
    subtitle: "커리어 고민이나 협업 제안을 가볍게 나눠요",
    badge: "30분",
    url: "mailto:hong.gildong@example.com?subject=커피챗 문의",
    iconBg: "bg-[#F3E8FF]",
    iconColor: "text-[#7C3AED]",
    icon: <IconCoffee className="w-5 h-5" />,
  },
];

const CAREER_TIMELINE = [
  {
    period: "2024.03 ~ 현재",
    role: "시니어 프론트엔드 엔지니어",
    company: "테크 이노베이션즈",
    description: "핵심 웹 프로덕트 프론트엔드 아키텍처 리드 및 디자인 시스템 전면 구축",
    isCurrent: true,
  },
  {
    period: "2022.02 ~ 2024.02",
    role: "프론트엔드 개발자",
    company: "스튜디오 넥서스",
    description: "SaaS 플랫폼 개발, 웹 성능 지표(LCP, FID) 45% 개선",
    isCurrent: false,
  },
  {
    period: "2020.03 ~ 2022.01",
    role: "주니어 웹 개발자",
    company: "디지털 웨이브",
    description: "다양한 브랜드의 반응형 웹사이트 및 프로모션 페이지 구축",
    isCurrent: false,
  },
];

const TECH_SKILLS = [
  {
    category: "프론트엔드",
    items: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS v4", "HTML/CSS"],
  },
  {
    category: "상태 및 최적화",
    items: ["Zustand", "TanStack Query", "Turbopack", "웹 성능 최적화"],
  },
  {
    category: "백엔드 및 클라우드",
    items: ["Node.js", "Supabase", "PostgreSQL", "Vercel"],
  },
  {
    category: "협업 도구",
    items: ["Figma", "Git", "GitHub", "디자인 시스템"],
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"all" | "links" | "projects" | "about">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hong.gildong@example.com");
      showToast("이메일 주소를 복사했어요");
    } catch {
      showToast("이메일: hong.gildong@example.com");
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "홍길동 | 프론트엔드 개발자 프로필",
          text: "프론트엔드 개발자 홍길동의 프로필을 확인해 보세요.",
          url: window.location.href,
        });
      } catch {
        // 취소됨
      }
    } else if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(window.location.href);
      showToast("프로필 링크를 복사했어요");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] pb-24 selection:bg-[#3182F6] selection:text-white">
      {/* TDS Toast 메시지 */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-200">
          <div className="bg-[#191F28] text-white text-[15px] font-medium px-5 py-3.5 rounded-[14px] tds-shadow-toast flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center shrink-0">
              <IconCheck className="w-3.5 h-3.5 text-white" />
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 상단 TopBar (56px) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold text-[#191F28]">홍길동</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              type="button"
              className="p-2 rounded-full text-[#4E5968] hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors"
              title="공유하기"
            >
              <IconShare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 컨테이너 */}
      <main className="max-w-2xl mx-auto px-4 sm:px-5 pt-4 space-y-4">
        {/* 1. 프로필 히어로 카드 */}
        <section className="bg-white rounded-[24px] p-6 sm:p-7 tds-shadow-1">
          {/* 가용 상태 뱃지 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3FF] text-[#3182F6] text-[13px] font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-[#3182F6]" />
            <span>새로운 프로젝트에 참여할 수 있어요</span>
          </div>

          {/* 프로필 이미지 & 기본 정보 */}
          <div className="flex items-start gap-4 sm:gap-5 mb-5">
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-[20px] overflow-hidden bg-[#F2F4F6] shrink-0 border border-[#E5E8EB]">
              <Image
                src="/images/avatar.jpg"
                alt="홍길동 프로필 사진"
                fill
                sizes="88px"
                priority
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-[26px] sm:text-[28px] font-bold text-[#191F28] tracking-tight leading-tight mb-1">
                홍길동
              </h1>
              <p className="text-[15px] sm:text-[16px] font-medium text-[#4E5968] mb-1">
                시니어 프론트엔드 엔지니어
              </p>
              <p className="text-[13px] text-[#8B95A1]">
                서울 · 경력 5년 · Next.js & React
              </p>
            </div>
          </div>

          {/* 소개글 (해요체) */}
          <p className="text-[15px] sm:text-[16px] text-[#333D4B] leading-relaxed break-keep mb-6">
            사용자 경험을 고민하며 더 나은 가치를 만드는 개발자예요. 복잡한 문제를 직관적이고 깔끔한 화면으로 해결하는 것을 좋아해요.
          </p>

          {/* 퀵 액션 버튼 (TDS 규정: 화면당 단 하나의 Blue 버튼) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyEmail}
              type="button"
              className="flex-1 h-12 rounded-[14px] bg-[#3182F6] hover:bg-[#1B64DA] active:bg-[#1453B8] text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <IconCopy className="w-4 h-4" />
              <span>이메일 복사하기</span>
            </button>
            <a
              href="mailto:hong.gildong@example.com?subject=협업 제안"
              className="flex-1 h-12 rounded-[14px] bg-[#F2F4F6] hover:bg-[#E5E8EB] active:bg-[#D1D6DB] text-[#191F28] text-[15px] font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <IconMail className="w-4 h-4 text-[#4E5968]" />
              <span>연락하기</span>
            </a>
          </div>
        </section>

        {/* 2. 핵심 지표 카드 (TDS Tabular Numbers) */}
        <section className="bg-white rounded-[24px] p-5 sm:p-6 tds-shadow-1">
          <div className="grid grid-cols-3 divide-x divide-[#E5E8EB] text-center">
            <div className="px-2">
              <span className="block text-[22px] sm:text-[26px] font-bold text-[#191F28] tabular-nums">
                5년
              </span>
              <span className="text-[13px] text-[#6B7684] mt-0.5 block">
                실무 개발 경력
              </span>
            </div>
            <div className="px-2">
              <span className="block text-[22px] sm:text-[26px] font-bold text-[#191F28] tabular-nums">
                30개
              </span>
              <span className="text-[13px] text-[#6B7684] mt-0.5 block">
                완료한 프로젝트
              </span>
            </div>
            <div className="px-2">
              <span className="block text-[22px] sm:text-[26px] font-bold text-[#191F28] tabular-nums">
                1,500+
              </span>
              <span className="text-[13px] text-[#6B7684] mt-0.5 block">
                오픈소스 기여
              </span>
            </div>
          </div>
        </section>

        {/* 3. TDS 탭 컨트롤러 (Pill Segmented Chips) */}
        <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab("all")}
            type="button"
            className={`h-9 px-4 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-[#191F28] text-white"
                : "bg-white text-[#4E5968] hover:bg-[#E5E8EB] border border-[#E5E8EB]"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab("links")}
            type="button"
            className={`h-9 px-4 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors ${
              activeTab === "links"
                ? "bg-[#191F28] text-white"
                : "bg-white text-[#4E5968] hover:bg-[#E5E8EB] border border-[#E5E8EB]"
            }`}
          >
            주요 링크
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            type="button"
            className={`h-9 px-4 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors ${
              activeTab === "projects"
                ? "bg-[#191F28] text-white"
                : "bg-white text-[#4E5968] hover:bg-[#E5E8EB] border border-[#E5E8EB]"
            }`}
          >
            프로젝트
          </button>
          <button
            onClick={() => setActiveTab("about")}
            type="button"
            className={`h-9 px-4 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors ${
              activeTab === "about"
                ? "bg-[#191F28] text-white"
                : "bg-white text-[#4E5968] hover:bg-[#E5E8EB] border border-[#E5E8EB]"
            }`}
          >
            경력 및 스킬
          </button>
        </section>

        {/* 4. 주요 링크 (TDS ListRow 표준 규격) */}
        {(activeTab === "all" || activeTab === "links") && (
          <section className="bg-white rounded-[24px] p-5 sm:p-6 tds-shadow-1">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[18px] font-bold text-[#191F28]">주요 링크</h2>
              <span className="text-[13px] text-[#8B95A1]">바로가기</span>
            </div>

            <div className="divide-y divide-[#E5E8EB]">
              {BIO_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center justify-between py-3.5 px-2 rounded-[16px] hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-[14px] ${link.iconBg} ${link.iconColor} flex items-center justify-center shrink-0`}
                    >
                      {link.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[16px] font-semibold text-[#191F28] truncate">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F2F4F6] text-[#4E5968] shrink-0">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[14px] text-[#6B7684] truncate">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-[#B0B8C1] group-hover:text-[#4E5968] transition-colors ml-2 shrink-0" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 5. 대표 프로젝트 섹션 */}
        {(activeTab === "all" || activeTab === "projects") && (
          <section className="bg-white rounded-[24px] p-5 sm:p-6 tds-shadow-1 space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[18px] font-bold text-[#191F28]">대표 프로젝트</h2>
              <span className="text-[13px] text-[#8B95A1]">직접 만든 제품</span>
            </div>

            <div className="space-y-4">
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="border border-[#E5E8EB] rounded-[20px] p-4 sm:p-5 hover:border-[#B0B8C1] transition-all"
                >
                  {/* 프로젝트 썸네일 이미지 */}
                  <div className="relative w-full h-44 sm:h-52 rounded-[14px] overflow-hidden bg-[#F2F4F6] mb-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 600px"
                      className="object-cover object-center"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-white/90 text-[#191F28] backdrop-blur-md border border-[#E5E8EB]">
                        {project.badge}
                      </span>
                    </div>
                  </div>

                  {/* 프로젝트 상세 정보 */}
                  <div>
                    <h3 className="text-[17px] font-bold text-[#191F28] mb-0.5">
                      {project.title}
                    </h3>
                    <p className="text-[13px] font-medium text-[#3182F6] mb-2">
                      {project.subtitle}
                    </p>
                    <p className="text-[14px] text-[#4E5968] leading-relaxed break-keep mb-3.5">
                      {project.description}
                    </p>

                    {/* 기술 태그 */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-[8px] text-[12px] font-medium bg-[#F2F4F6] text-[#4E5968]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#E5E8EB]">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-10 rounded-[12px] bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#191F28] text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <IconExternalLink className="w-4 h-4 text-[#4E5968]" />
                        <span>데모 체험하기</span>
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-10 rounded-[12px] bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#191F28] text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <IconGitHub className="w-4 h-4 text-[#4E5968]" />
                        <span>코드 확인하기</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. 기술 스택 & 경력 이력 섹션 */}
        {(activeTab === "all" || activeTab === "about") && (
          <div className="space-y-4">
            {/* 기술 스택 카드 */}
            <section className="bg-white rounded-[24px] p-5 sm:p-6 tds-shadow-1">
              <h2 className="text-[18px] font-bold text-[#191F28] mb-4 px-1">
                기술 스택
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TECH_SKILLS.map((skill) => (
                  <div
                    key={skill.category}
                    className="p-3.5 rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB]"
                  >
                    <span className="text-[12px] font-semibold text-[#8B95A1] block mb-2">
                      {skill.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.items.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-[8px] bg-white border border-[#E5E8EB] text-[13px] font-medium text-[#333D4B]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 경력 이력 카드 */}
            <section className="bg-white rounded-[24px] p-5 sm:p-6 tds-shadow-1">
              <h2 className="text-[18px] font-bold text-[#191F28] mb-4 px-1">
                경력 이력
              </h2>
              <div className="space-y-4">
                {CAREER_TIMELINE.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3 rounded-[16px] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center shrink-0 mt-0.5">
                      <IconBriefcase className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[15px] font-bold text-[#191F28]">
                          {item.company}
                        </span>
                        {item.isCurrent && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F3FF] text-[#3182F6]">
                            재직 중
                          </span>
                        )}
                      </div>
                      <p className="text-[14px] font-medium text-[#4E5968] mb-1">
                        {item.role} · <span className="tabular-nums text-[#8B95A1]">{item.period}</span>
                      </p>
                      <p className="text-[13px] text-[#6B7684] leading-relaxed break-keep">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 7. 하단 안내 및 협업 제안 카드 */}
        <section className="bg-[#E8F3FF] rounded-[24px] p-6 text-center">
          <span className="inline-block text-[13px] font-semibold text-[#3182F6] mb-1.5">
            함께 일해요
          </span>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#191F28] mb-2 break-keep">
            새로운 프로젝트나 협업을 준비하고 계신가요?
          </h2>
          <p className="text-[14px] text-[#4E5968] max-w-md mx-auto mb-5 break-keep">
            스타트업 MVP 제작부터 웹 프론트엔드 성능 개선까지 편하게 이야기 나눠요.
          </p>
          <a
            href="mailto:hong.gildong@example.com?subject=협업 제안"
            className="inline-flex items-center justify-center h-12 px-6 rounded-[14px] bg-[#3182F6] hover:bg-[#1B64DA] active:bg-[#1453B8] text-white text-[15px] font-bold transition-colors"
          >
            협업 제안하기
          </a>
        </section>

        {/* 8. 푸터 */}
        <footer className="text-center py-6 text-[13px] text-[#8B95A1] space-y-1">
          <p>© 2026 홍길동. All rights reserved.</p>
          <p>Toss Design System (TDS) 가이드라인을 준수하여 제작되었어요.</p>
        </footer>
      </main>

      {/* 9. 화면 최하단 고정 액션 (TDS BottomCTA) */}
      <aside aria-label="빠른 액션 바" className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        {/* 보호 그라디언트 (white -> transparent) */}
        <div className="h-8 bg-gradient-to-t from-white to-transparent" />
        <div className="bg-white border-t border-[#E5E8EB] px-4 py-3 pointer-events-auto">
          <div className="max-w-2xl mx-auto flex items-center gap-2.5">
            <button
              onClick={handleCopyEmail}
              type="button"
              className="flex-1 h-14 rounded-[16px] bg-[#3182F6] hover:bg-[#1B64DA] active:bg-[#1453B8] text-white text-[17px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <IconMail className="w-5 h-5" />
              <span>이메일 복사하기</span>
            </button>
            <a
              href="mailto:hong.gildong@example.com?subject=커피챗 문의"
              className="h-14 px-5 rounded-[16px] bg-[#F2F4F6] hover:bg-[#E5E8EB] active:bg-[#D1D6DB] text-[#191F28] text-[15px] font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <IconCoffee className="w-4 h-4 text-[#4E5968]" />
              <span>커피챗</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
