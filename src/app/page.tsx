export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-200/80 dark:border-zinc-800 flex flex-col items-center text-center">
        {/* 프로필 아바타 */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            홍
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold tracking-tight mb-2">홍길동</h1>

        {/* 역할 / 신분 태그 */}
        <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          Frontend Developer
        </span>

        {/* 소개글 */}
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs break-keep">
          사용자 경험을 고민하며 더 나은 가치를 만드는 개발자입니다. 복잡한 문제를 직관적이고 깔끔한 코드로 해결하는 것을 즐깁니다.
        </p>

        {/* 간단한 링크 / 버튼 섹션 */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
          >
            연락하기
          </button>
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            포트폴리오 보러가기
          </button>
        </div>
      </div>
    </main>
  );
}
