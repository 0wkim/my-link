import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Globe2,
  Layers3,
  Link2,
  MessageCircleHeart,
  Palette,
  Plus,
  QrCode,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";

const featureCards = [
  {
    icon: Link2,
    title: "한 곳에 모으는 모든 링크",
    description: "SNS, 포트폴리오, 예약 페이지까지. 방문자가 길을 잃지 않도록 가장 중요한 곳으로 안내해요.",
    accent: "bg-[#E8F3FF] text-[#3182F6]",
  },
  {
    icon: Palette,
    title: "나답게 꾸미는 프로필",
    description: "가볍고 깔끔한 테마부터 생생한 컬러까지. 내 분위기에 맞게 페이지의 인상을 바꿔 보세요.",
    accent: "bg-[#F3EEFF] text-[#7C5CFC]",
  },
  {
    icon: BarChart3,
    title: "반응을 읽는 간단한 통계",
    description: "어떤 링크가 관심을 받는지 한눈에 보고, 다음 콘텐츠를 더 자신 있게 정할 수 있어요.",
    accent: "bg-[#E8F8F1] text-[#10A36A]",
  },
];

const steps = [
  { number: "01", title: "프로필 만들기", description: "이름과 한 줄 소개로 나만의 작은 홈을 열어요." },
  { number: "02", title: "링크 채우기", description: "사람들이 가장 먼저 봐야 할 링크부터 차곡차곡 담아요." },
  { number: "03", title: "가볍게 공유하기", description: "프로필 하나로 어디서든 나를 소개하고 연결해요." },
];

const previewLinks = [
  { label: "이번 주 가장 많이 본 글", detail: "뉴스레터 · 3 min read", color: "bg-[#FFF1D8]", mark: "N" },
  { label: "작업 포트폴리오", detail: "Selected projects", color: "bg-[#E8F3FF]", mark: "P" },
  { label: "가볍게 이야기 나눠요", detail: "Instagram · @mylink", color: "bg-[#FDEBF2]", mark: "I" },
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#F7F9FC] text-[#191F28]">
      <section className="relative isolate overflow-hidden border-b border-[#E5E8EB] bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_50%_-8%,#D7E9FF_0%,rgba(232,243,255,0.8)_32%,rgba(255,255,255,0)_70%)]" />
        <div className="pointer-events-none absolute left-[8%] top-40 -z-10 h-28 w-28 rounded-full bg-[#E8F3FF] blur-2xl" />
        <div className="pointer-events-none absolute right-[9%] top-24 -z-10 h-24 w-24 rounded-full bg-[#EDE7FF] blur-2xl" />

        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8" aria-label="주요 메뉴">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-75">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#3182F6] text-sm font-black text-white shadow-sm">M</span>
            <span className="text-[17px] font-extrabold tracking-[-0.05em]">MYLINK</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="#features" className="hidden px-3 py-2 text-sm font-semibold text-[#6B7684] transition-colors hover:text-[#3182F6] sm:inline-flex">기능</a>
            <Link href="/manage" className="inline-flex h-10 items-center justify-center rounded-full bg-[#191F28] px-4 text-[13px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:h-11 sm:px-5 sm:text-sm">
              내 링크 관리
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-28 lg:pt-20">
          <div className="max-w-xl text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#CDE3FF] bg-white/80 px-3 py-1.5 text-[13px] font-bold text-[#3182F6] shadow-sm backdrop-blur">
              <Sparkles className="size-3.5 fill-current" aria-hidden="true" />
              링크는 가볍게, 연결은 더 깊게
            </div>
            <h1 className="text-[38px] font-extrabold leading-[1.15] tracking-[-0.07em] text-[#191F28] sm:text-5xl lg:text-[58px]">
              당신을 소개하는
              <br />
              가장 짧고 멋진 <span className="whitespace-nowrap text-[#3182F6]">한 페이지</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[16px] font-medium leading-relaxed tracking-[-0.03em] text-[#6B7684] sm:text-[18px] lg:mx-0">
              흩어진 모든 링크를 한곳에 모으고, 나다운 모습으로 가볍게 공유하세요. MYLINK가 첫 연결을 더 쉽게 만들어요.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/manage" className="inline-flex h-14 items-center justify-center gap-2 rounded-[18px] bg-[#3182F6] px-6 text-[16px] font-extrabold text-white shadow-[0_10px_24px_rgba(49,130,246,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#1B64DA] active:translate-y-0">
                무료로 내 링크 만들기 <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="inline-flex h-14 items-center justify-center gap-2 rounded-[18px] border border-[#D1D6DB] bg-white px-6 text-[16px] font-bold text-[#333D4B] transition-colors hover:border-[#3182F6] hover:text-[#3182F6]">
                어떻게 쓰나요 <ChevronRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-7 flex items-center justify-center gap-4 text-[13px] font-semibold text-[#6B7684] lg:justify-start">
              <span className="flex items-center gap-1.5"><Check className="size-4 text-[#3182F6]" aria-hidden="true" />바로 시작 가능</span>
              <span className="flex items-center gap-1.5"><Check className="size-4 text-[#3182F6]" aria-hidden="true" />모바일에 딱 맞게</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
            <div className="absolute -right-3 top-12 hidden rotate-6 rounded-2xl border border-[#D9E8FF] bg-white/75 px-4 py-3 text-sm font-bold text-[#3182F6] shadow-lg backdrop-blur sm:flex sm:items-center sm:gap-2">
              <Sparkles className="size-4" aria-hidden="true" /> 오늘의 링크, 완성!
            </div>
            <div className="absolute -left-5 bottom-12 z-10 hidden -rotate-6 rounded-2xl bg-[#191F28] px-4 py-3 text-[13px] font-bold text-white shadow-xl sm:flex sm:items-center sm:gap-2">
              <Share2 className="size-4 text-[#84BDFF]" aria-hidden="true" /> 하나의 링크로 공유해요
            </div>
            <div className="relative rounded-[32px] border border-white/80 bg-white p-3 shadow-[0_28px_70px_rgba(49,130,246,0.18)] sm:p-4">
              <div className="overflow-hidden rounded-[24px] bg-[#F7F9FC] p-4 sm:p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-[9px] bg-[#3182F6] text-[11px] font-black text-white">M</span>
                    <span className="text-sm font-extrabold tracking-[-0.04em]">MYLINK</span>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#8B95A1] shadow-sm">미리보기</span>
                </div>
                <div className="rounded-[22px] bg-white p-4 text-center shadow-[0_4px_20px_rgba(25,31,40,0.05)] sm:p-5">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#D7EAFF,#AFCFFF)] text-lg font-black text-[#3182F6] ring-4 ring-[#F4F8FF]">Y</div>
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <p className="font-extrabold tracking-[-0.04em]">youngwoo&apos;s note</p>
                    <span className="flex size-4 items-center justify-center rounded-full bg-[#3182F6] text-[9px] text-white">✓</span>
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[#8B95A1]">좋아하는 것을 기록하고 연결합니다.</p>
                  <div className="mt-4 space-y-2.5 text-left">
                    {previewLinks.map((link) => (
                      <div key={link.label} className="group flex items-center gap-3 rounded-2xl border border-[#EDF0F3] bg-white p-3 transition-transform hover:translate-x-1">
                        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-[#333D4B] ${link.color}`}>{link.mark}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-bold tracking-[-0.03em]">{link.label}</span>
                          <span className="block truncate pt-0.5 text-[11px] font-medium text-[#8B95A1]">{link.detail}</span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-[#B0B8C1] transition-colors group-hover:text-[#3182F6]" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold text-[#3182F6]">작지만 단단한 연결</p>
          <h2 className="mt-3 text-[30px] font-extrabold leading-tight tracking-[-0.06em] sm:text-[40px]">링크 하나에, 당신의 오늘을 담아요.</h2>
          <p className="mt-4 text-[16px] font-medium leading-relaxed text-[#6B7684]">MYLINK는 복잡한 설정 없이도 내 이야기가 선명하게 보이는 링크 페이지를 만들 수 있도록 돕습니다.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="group rounded-[28px] border border-[#E5E8EB] bg-white p-6 shadow-[0_4px_18px_rgba(25,31,40,0.03)] transition-all hover:-translate-y-1 hover:border-[#CFE4FF] hover:shadow-[0_14px_32px_rgba(49,130,246,0.11)] sm:p-7">
                <span className={`flex size-12 items-center justify-center rounded-2xl ${feature.accent}`}><Icon className="size-6" aria-hidden="true" /></span>
                <h3 className="mt-6 text-xl font-extrabold tracking-[-0.05em]">{feature.title}</h3>
                <p className="mt-3 text-[15px] font-medium leading-relaxed text-[#6B7684]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[#E5E8EB] bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]"><Layers3 className="size-6" aria-hidden="true" /></div>
            <p className="mt-6 text-sm font-extrabold text-[#3182F6]">딱 세 번의 가벼운 터치</p>
            <h2 className="mt-3 text-[30px] font-extrabold leading-tight tracking-[-0.06em] sm:text-[40px]">시작은 쉽게,
              <br />공유는 자연스럽게.</h2>
            <p className="mt-4 max-w-md text-[16px] font-medium leading-relaxed text-[#6B7684]">내가 어떤 사람인지 보여 주는 일은 생각보다 간단해야 하니까요.</p>
            <Link href="/manage" className="mt-7 inline-flex items-center gap-2 text-[15px] font-extrabold text-[#3182F6] transition-transform hover:translate-x-1">내 페이지 만들러 가기 <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-4 rounded-[24px] border border-[#E5E8EB] bg-[#F9FAFB] p-5 transition-colors hover:bg-[#F3F8FF] sm:items-center sm:gap-6 sm:p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-[#3182F6] shadow-sm">{step.number}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold tracking-[-0.04em]">{step.title}</h3>
                  <p className="mt-1 text-[14px] font-medium leading-relaxed text-[#6B7684]">{step.description}</p>
                </div>
                {index === 2 ? <Share2 className="hidden size-5 text-[#3182F6] sm:block" aria-hidden="true" /> : <Plus className="hidden size-5 text-[#B0B8C1] sm:block" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="rounded-[32px] bg-[#191F28] px-6 py-10 text-white shadow-[0_18px_46px_rgba(25,31,40,0.2)] sm:rounded-[40px] sm:px-12 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-bold text-[#B9D9FF]"><MessageCircleHeart className="size-3.5" aria-hidden="true" />당신의 다음 연결을 위해</span>
              <h2 className="mt-5 text-[30px] font-extrabold leading-tight tracking-[-0.06em] sm:text-[42px]">이제, 나를 한 링크로
                <br className="hidden sm:block" /> 소개해 볼까요?</h2>
              <p className="mt-4 max-w-lg text-[16px] font-medium leading-relaxed text-[#B0B8C1]">프로필 하나를 만들면, 어디에서든 당신에게 가장 중요한 곳으로 사람들을 초대할 수 있어요.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/manage" className="inline-flex h-14 items-center justify-center gap-2 rounded-[18px] bg-[#3182F6] px-6 text-[16px] font-extrabold text-white transition-colors hover:bg-[#5A9EFF]">MYLINK 시작하기 <ArrowRight className="size-4" aria-hidden="true" /></Link>
              <a href="#features" className="inline-flex h-14 items-center justify-center gap-2 rounded-[18px] border border-white/20 px-6 text-[16px] font-bold text-white transition-colors hover:bg-white/10">기능 다시 보기</a>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-[13px] font-semibold text-[#B0B8C1]">
            <span className="flex items-center gap-2"><UserRound className="size-4 text-[#84BDFF]" aria-hidden="true" />내 이름으로 만드는 프로필</span>
            <span className="flex items-center gap-2"><Globe2 className="size-4 text-[#84BDFF]" aria-hidden="true" />언제 어디서나 열리는 페이지</span>
            <span className="flex items-center gap-2"><QrCode className="size-4 text-[#84BDFF]" aria-hidden="true" />한 번에 공유하는 링크</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E8EB] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-[9px] bg-[#3182F6] text-xs font-black text-white">M</span><span className="font-extrabold tracking-[-0.05em]">MYLINK</span></Link>
          <p className="text-[13px] font-medium text-[#8B95A1]">나만의 모바일 링크 허브 · © 2026 MYLINK</p>
        </div>
      </footer>
    </main>
  );
}
