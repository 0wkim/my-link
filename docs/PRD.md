# [PRD] 마이링크 (MyLink) 제품 기능 정의서 (LocalStorage & Mock 데이터 기반)

> **문서 버전**: v1.5.0 (모듈 CSS 배제 & Tailwind CSS v4 단일화, shadcn/ui 기반 컴포넌트 모듈화 마일스톤)  
> **최종 수정 일자**: 2026-10-10  
> **상태**: 승인됨 (Approved)  
> **아키텍처**: 서버리스 클라이언트 사이드 (Local-First Architecture, Zustand & LocalStorage Mock 연동) + Next.js App Router Mock REST API  
> **기본 기술 스택**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4 (단일 스타일링 체계, Zero CSS Modules), shadcn/ui (TDS 커스텀 디자인 시스템), Zustand

---

## 1. 프로젝트 개요 (Overview)

### 1.1 서비스 비전
**"별도 백엔드 서버 없이 브라우저에서 즉시 체험하고 동작하는 한국형 링크트리, 마이링크(MyLink)"**  
마이링크는 크리에이터, 프리랜서, 개발자가 자신의 소셜 미디어, 포트폴리오, 작업물, 연락처를 단 하나의 모바일 최적화된 링크로 모아서 전달할 수 있는 링크인바이오(Link-in-bio) 서비스입니다.  
본 버전은 복잡한 외부 클라우드 DB나 백엔드 서버 구축 없이 **브라우저 `LocalStorage` 및 내장 Mock 데이터 저장소**를 통해 독립적으로 완벽 동작하도록 설계되었습니다.

### 1.2 마일스톤 및 개발 단계 정의 (Development Phases)
사용자 요구사항에 따라 복잡한 관리자 대시보드와 통계 기능을 즉시 개발하지 않고, **로컬 스토리지를 활용한 완성도 높은 프로필 페이지**를 1단계(Phase 1)로 먼저 구축합니다.

- 🎯 **Phase 1 (현재 대상 - 핵심 프로필 페이지 MVP)**
  - LocalStorage 및 Mock 데이터를 연동한 완성도 높은 프로필 페이지 (`/` 및 `/@:username`)
  - Zustand `persist` 기반의 프로필, 링크 목록, 테마 스타일 로컬 영속화 및 초기 시드 데이터(`@hong`) 로드
  - 프로필 이미지, 닉네임, 소개글, 활성화된 링크 목록, 반응형 모바일 최적화 레이아웃
  - 링크 클릭 아웃바운드 연결 및 프로필 공유(클립보드 복사)
  - **모듈 CSS 전면 배제 및 Tailwind CSS v4 단일화**: Zero CSS Modules 원칙에 따라 모든 스타일을 Tailwind CSS v4 유틸리티 클래스로 통일
  - **shadcn/ui 기반 컴포넌트 모듈화**: `Button`, `Card`, `Badge`, `Avatar`, `Input`, `Dialog`, `Separator` 등 아토믹 컴포넌트 구축 및 페이지 컴포넌트 재사용 분리
- ⏳ **Phase 2 (차기 마일스톤 - 관리 도구 및 통계)**
  - 관리자 대시보드 (`/admin`) 및 실시간 모바일 목업 프리뷰 에디터
  - 링크 CRUD (추가/수정/삭제/토글) 및 드래그 앤 드롭 순서 변경
  - 테마 커스터마이저 (배경색, 버튼 라운딩, 외곽선 스타일)
  - 통계 기능 (`/admin/analytics` - 방문자 수, 링크별 누적 클릭수, CTR 분석)
  - Mock 소셜 간편 로그인 (`/login`)

### 1.3 핵심 가치 제안 (Value Proposition)
1. **Zero-Config 즉시 실행**: DB나 API 서버 설정 없이 `npm run dev`만으로 브라우저에서 즉시 동작
2. **영속적 로컬 스토리지 (LocalStorage)**: 브라우저를 새로고침하거나 재방문해도 로컬에 저장된 프로필, 링크, 테마가 그대로 유지
3. **shadcn/ui 기반 토스 디자인 시스템 (TDS) 컴포넌트 재사용성**: headless 접근성이 보장된 최신 shadcn/ui 컴포넌트(`src/components/ui/*`)를 기반으로, `docs/design.md`의 토스 디자인 시스템(TDS) 비주얼 토큰(Toss Blue, 8단 그레이스케일, 공격적 라운드 래더, 모바일 최적화 터치 타겟)을 100% 결합하여 모바일 및 데스크톱 전 구간에서 완성도 높은 사용자 경험 제공
4. **Tailwind CSS v4 단일 스타일링 표준 (Zero CSS Modules)**: 파편화된 CSS Modules나 인라인 스타일을 배제하고 Tailwind CSS v4 `@theme inline` 및 `@utility` 체계로 스타일링을 일원화하여 유지보수성 및 일관성 극대화
5. **Mock 기반 멀티 핸들 지원**: 기본 샘플 계정(`@hong`, `@sujin`) 제공 및 로컬 스토리지 키 기반 데이터 조회

### 1.4 핵심 사용자 시나리오 및 페르소나 (User Personas & Scenarios)

> 모든 시나리오는 구체적인 사용자 페르소나를 기반으로 하며, 단계별 행동은 **"사용자는 ___ 하기 위해 ___ 한다"** 형식으로 명확히 정의합니다.

---

#### 1. 방문자 관점: 다른 사람의 마이링크 페이지를 방문하는 과정

##### 👤 페르소나: 김민수 (27세, 스타트업 주니어 프로덕트 디자이너)
- **배경 및 성향**: 모바일 환경에서 SNS(인스타그램, X/트위터, 링크드인)를 활발히 탐색하며, 동종 업계 크리에이터들의 디자인 포트폴리오와 기술 블로그 아티클을 꾸준히 레퍼런스로 수집함.
- **주요 목표 (Goals)**: SNS 피드에서 인상 깊게 본 개발자/크리에이터 '홍길동'의 전체 포트폴리오, 운영 중인 기술 블로그, GitHub 저장소를 한 페이지에서 지연 없이 빠르게 확인하고 유익한 글을 북마크하거나 동료에게 공유하기.
- **불편 사항 (Pain Points)**: 외부 링크 로딩이 2~3초 이상 지연되거나 광고 배너가 과도하게 뜨는 기존 링크트리 페이지에 피로감을 느낌. 모바일에서 터치 영역이 좁거나 폰트 가독성이 떨어지는 디자인을 기피함.

##### 📋 단계별 구체적 시나리오
- **1단계 (유입 및 접속)**: 사용자는 인스타그램 피드에서 관심 크리에이터(홍길동)의 게시물을 둘러본 후 소개글의 전체 채널 및 작업물 목록을 확인하기 위해 프로필 바이오에 등록된 마이링크 단축 URL(`/@hong`)을 탭한다.
- **2단계 (화면 로딩 및 신원 확인)**: 사용자는 접속한 페이지가 자신이 찾던 실제 크리에이터의 공식 페이지가 맞는지 검증하기 위해 백엔드 대기 없이 즉시 로드(0.1초 미만)되는 상단 원형 아바타, 실명 닉네임, 그리고 한 줄 소개글("복잡한 문제를 단순하게...")을 확인한다.
- **3단계 (목적 링크 카드 탐색)**: 사용자는 본인이 관심 있는 세부 작업물(포트폴리오 웹사이트, 기술 블로그, GitHub 프로젝트 등)의 위치를 파악하기 위해 토스 TDS 스타일로 정돈된 링크 카드 리스트를 아래로 스크롤하며 아이콘과 제목, 도메인 텍스트를 살펴본다.
- **4단계 (링크 탭 및 외부 이동)**: 사용자는 크리에이터의 최신 개발 회고록 아티클을 직접 정독하기 위해 '기술 블로그' 카드를 탭하여 기존 마이링크 화면을 유지한 채 새 브라우저 탭으로 안전하게 연결된다.
- **5단계 (프로필 공유 및 추천)**: 사용자는 인상 깊었던 해당 크리에이터의 전체 링크 허브를 사내 스터디 팀원들에게 메신저로 전달하기 위해 우측 상단의 [공유] 버튼을 눌러 단축 URL을 클립보드에 복사하고 전송한다.

---

#### 2. 소유자 관점: 자신의 마이링크를 관리하는 과정 (링크 추가, 수정, 삭제)

##### 👤 페르소나: 이수진 (31세, 프리랜서 일러스트레이터 겸 테크 크리에이터)
- **배경 및 성향**: 포트폴리오 웹사이트, 브런치 기술 연재, 유튜브 채널, 외주 의뢰용 오픈채팅, 굿즈 판매 스토어 등 5개 이상의 분산된 채널을 운영 중임. 새로운 프로젝트 출시나 외주 모집 시즌마다 SNS 프로필 링크를 번거롭게 교체해 옴.
- **주요 목표 (Goals)**: 복잡한 백엔드 서버나 호스팅 비용 없이, 브라우저에서 바로 자신의 최신 작업물 링크를 등록/정렬하고 모바일 목업 화면으로 실시간 결과를 확인하며 간편하게 관리하기.
- **불편 사항 (Pain Points)**: 수정 사항이 모바일 화면에서 어떻게 보일지 즉시 가늠하기 어렵고, 매번 배포나 저장이 늦어지거나 데이터가 날아갈까 봐 불안함을 느낌.

##### 📋 단계별 구체적 시나리오
- **1단계 (관리자 진입)**: 사용자는 최근 오픈한 굿즈 펀딩 프로젝트와 새로 작성한 외주 안내 링크를 프로필에 반영하기 위해 브라우저를 켜고 마이링크 관리자 편집 페이지(`/admin/links`)에 접속한다.
- **2단계 (신규 링크 추가)**:
  - 사용자는 신규 텀블벅 펀딩 페이지로 팬들을 유도하기 위해 화면 상단의 `[+ 새 링크 추가]` 버튼을 클릭한다.
  - 사용자는 방문자에게 명확한 이동 목적을 인지시키기 위해 링크 카드 입력창에 제목("2026 아트북 & 굿즈 펀딩"), 목적지 URL, 대표 쇼핑 아이콘을 입력한다.
  - 사용자는 방금 추가한 펀딩 링크 카드가 모바일 환경에서 텍스트 줄바꿈이나 버튼 너비에 어색함이 없는지 점검하기 위해 우측 40% 영역의 실시간 스마트폰 목업 화면을 즉시 확인한다.
- **3단계 (기존 링크 수정 및 순서 재배치)**:
  - 사용자는 변경된 외주 문의 방식(카카오톡 오픈채팅 주소 변경)을 갱신하기 위해 기존 문의 링크 카드를 클릭하여 텍스트 필드를 직접 수정한다.
  - 사용자는 현재 마감된 외주 접수 링크를 방문자에게 노출되지 않도록 일시 숨기기 위해 해당 카드의 `활성화/비활성화(ON/OFF)` 토글 스위치를 OFF로 전환한다.
  - 사용자는 현재 가장 홍보가 시급한 '굿즈 펀딩' 링크를 방문자가 화면을 열자마자 볼 수 있도록 좌측 드래그 핸들을 잡고 최상단 위치로 끌어올린다.
- **4단계 (불필요 링크 삭제)**:
  - 사용자는 작년에 종료되어 더 이상 운영하지 않는 이전 전시회 링크를 목록에서 영구 정리하기 위해 해당 카드의 `[삭제]`(휴지통) 아이콘을 클릭한다.
  - 사용자는 작업 실수로 중요한 다른 링크가 지워지는 사고를 방지하기 위해 화면에 팝업된 삭제 확인 경고 모달에서 한 번 더 확인 후 삭제를 승인한다.
- **5단계 (영속성 저장 및 최종 반영 점검)**:
  - 사용자는 브라우저를 닫거나 컴퓨터를 재부팅해도 지금까지 수정한 내용이 날아가지 않도록 로컬 스토리지(`LocalStorage`)에 실시간 자동 영속화되는 상태를 확인한다.
  - 사용자는 실제 방문자 시점에서 완벽하게 적용되었는지 최종 확인하기 위해 상단의 `[내 프로필 보기]` 버튼을 눌러 `/@hong`(또는 본인 핸들) 페이지로 이동하여 링크 클릭과 레이아웃을 직접 점검한다.

---

## 2. 시스템 아키텍처 및 기술 스택

| 영역 | 기술 스택 | 세부 구현 방식 |
| :--- | :--- | :--- |
| **프레임워크** | **Next.js 16 (App Router)** | 클라이언트 컴포넌트 기반 상태 관리 및 dynamic route(`/@:username`) |
| **라이브러리** | **React 19** | `useTransition`, `useState`, Context API를 활용한 반응형 상태 동기화 |
| **언어** | **TypeScript 5.8+** | 데이터 스키마 타입 안전성 보장 (`Profile`, `LinkItem`, `ThemeConfig` 등) |
| **UI 컴포넌트 시스템** | **shadcn/ui (최신 v4+)** | headless 접근성 프리미티브(`@base-ui/react`, Radix, Lucide React) 위에 `docs/design.md`의 토스 디자인 시스템(TDS) 스타일을 결합한 재사용 가능 단위 컴포넌트 분리 (`src/components/ui/button`, `card`, `badge`, `avatar`, `input`, `dialog`, `separator` 등) |
| **스타일링** | **Tailwind CSS v4 (Zero CSS Modules)** | 모듈 CSS(CSS Modules)를 전면 배제하고, `@theme inline`, `@utility` 및 Tailwind CSS v4 유틸리티 클래스로 100% 통일 |
| **전역 상태 관리** | **Zustand (`persist` 미들웨어)** | 컴포넌트 렌더링 최적화(Selector 구독), 실시간 프리뷰 0ms 무지연 동기화, `localStorage` 자동 영속화 |
| **데이터 저장소** | **브라우저 `LocalStorage`** | JSON 직렬화를 통한 영속 데이터 저장 및 Mock Repository 패턴 적용 |
| **인증 (Auth)** | **Mock Auth Provider** | 구글/카카오 원클릭 시뮬레이션 로그인 및 로컬 세션 유지 (`sessionStorage` / `localStorage`) |
| **이미지 처리** | **Base64 DataURL / 로컬 에셋** | 프로필 사진 업로드 시 FileReader API를 이용한 Base64 인코딩 저장 |
| **드래그 앤 드롭** | **HTML5 Drag & Drop / 경량 라이브러리** | 마우스 드래그 및 터치 지원 링크 노출 순서 재배치 |

---

## 3. 정보 구조 및 라우팅 (IA & Routing)

```
마이링크 (MyLink)
├── [Phase 1 대상 - 현재 구현 범위]
│   ├── / (기본 공개 프로필 뷰어 - LocalStorage @hong 기반)
│   └── /@:username (동적 핸들 공개 프로필 뷰어 - 예: /@hong)
│
└── [Phase 2 대상 - 차기 마일스톤]
    ├── /login (Mock 소셜 로그인 페이지)
    └── /admin (관리자 대시보드)
        ├── /admin/links (링크 관리 & 실시간 모바일 목업 프리뷰)
        ├── /admin/design (테마 & 프로필 디자인 커스텀)
        ├── /admin/analytics (방문자 & 클릭수 통계 확인)
        └── /admin/settings (핸들 변경, 데이터 초기화, 프로필 리셋)
```

---

## 4. 기능 요구사항 명세 (Functional Requirements)

### 4.1 Phase 1 핵심 기능 요구사항 (LocalStorage 기반 프로필 페이지)
*대시보드와 통계 구축 이전에, 로컬 스토리지와 연동되어 완전하게 동작하는 프로필 뷰어를 먼저 완성합니다.*

- **FR-1.1 LocalStorage 프로필 로드 및 Zustand 동기화**
  - 앱 마운트 시 브라우저 `localStorage`(`mylink_profiles`)에서 활성 프로필 데이터를 조회
  - 스토리지에 데이터가 비어 있는 경우 내장된 초기 Mock 시드 데이터(`@hong`)를 자동으로 스토리지에 주입하고 렌더링
  - Zustand `persist` 스토어와 연동하여 로컬 데이터와 컴포넌트 상태를 안정적으로 바인딩
- **FR-1.2 프로필 헤더 및 정보 렌더링**
  - 프로필 이미지: 로컬 저장된 이미지 또는 fallback 아바타 표시
  - 사용자 이름 및 핸들 표시: `홍길동` (`@hong`)
  - 한 줄 소개글 (Bio) 표시
- **FR-1.3 링크 블록 렌더링 및 아웃바운드 연결**
  - `isActive === true` 상태인 링크 카드들을 `displayOrder` 순으로 정렬하여 표시
  - 각 링크의 제목, 도메인/보조 텍스트, 아이콘(웹, 깃허브, 블로그 등) 표시
  - 클릭 시 새 탭(`target="_blank" rel="noopener noreferrer"`)으로 안전하게 목적지 URL 오픈
  - 호버 및 탭 시 부드러운 인터랙션 (스케일 및 배경색 피드백)
- **FR-1.4 shadcn/ui 기반 토스 TDS 디자인 시스템 및 모듈화 컴포넌트 아키텍처**
  - **Zero CSS Modules 원칙**: 별도의 CSS Module(`*.module.css`) 사용을 금지하고, 모든 스타일링을 Tailwind CSS v4 단일 체계로 일원화
  - **아토믹 UI 컴포넌트 분리 (`src/components/ui/`)**: `Button`, `Card`, `Badge`, `Avatar`, `Input`, `Dialog`, `Separator` 등 CVA와 접근성 프리미티브 기반으로 완전히 독립된 컴포넌트로 구축
  - **도메인 컴포넌트 재사용 설계**: 단일 모놀리식 페이지 대신 `ProfileHeader`, `LinkCard`, `LinkList`, `PinnedBanner`, `CategoryFilter`, `ProfileActions`, `IntroDialog` 등 세부 컴포넌트로 분리하여 관리자 프리뷰 및 향후 확장에서 100% 재사용 가능하도록 구성
  - **TDS 규격 매핑**: `docs/design.md`의 토스 디자인 시스템 가이드라인(토스 블루 `#3182f6`, 8단 그레이스케일, 12~24px 라운딩, 44px+ 터치 타겟)을 shadcn/ui 컴포넌트에 100% 반영
  - 모바일(320px~480px)부터 데스크톱(1024px+)까지 중앙 정렬된 모바일 최적화 뷰포트 유지
- **FR-1.5 프로필 공유 기능**
  - 우측 상단 공유 아이콘 클릭 시 현재 프로필 URL 클립보드 복사 및 토스트 알림 안내 (모바일의 경우 Web Share API 지원)

---

### 4.2 Phase 2 확장 기능 요구사항 (차기 마일스톤 - 대시보드 및 통계)
> ⚠️ 아래 기능들은 추후 관리 도구 개발 단계에서 순차적으로 구축될 예정이며, Phase 1 구현에서는 제외됩니다.

- **FR-2.1 Mock 인증 및 세션 관리 (`/login`)**
  - 원클릭 소셜 간편 로그인 시뮬레이션 및 `mylink_session` 세션 저장
- **FR-2.2 관리자 대시보드 & 실시간 프리뷰 (`/admin/links`)**
  - PC 스플릿 스크린 (좌측 편집 60% + 우측 스마트폰 목업 40%) 실시간 0ms 무지연 프리뷰
- **FR-2.3 링크 관리 CRUD 및 순서 변경**
  - 링크 추가/수정/삭제/활성화 토글
  - 드래그 앤 드롭 순서 변경 및 `displayOrder` 자동 갱신
- **FR-2.4 디자인 테마 커스터마이저 (`/admin/design`)**
  - 4종 프리셋(TDS, 미니멀, 다크, 비비드) 테마 및 버튼 모양/스타일 커스텀
- **FR-2.5 통계 대시보드 (`/admin/analytics`)**
  - 총 방문자 수, 링크별 누적 클릭수 카운팅 및 CTR 분석 지표

---

## 5. 데이터 모델 및 Mock 데이터 시스템 (Data Architecture)

### 5.1 데이터 모델 및 스키마 (TypeScript Types)
`src/types/link.ts`에 정의된 핵심 데이터 모델:

```typescript
// 1. 링크 아이템 인터페이스 (LinkItem)
interface LinkItem {
  id: string; // 고유 식별자 (예: "link-01")
  userHandle: string; // 소유자 핸들 (예: "hong")
  title: string; // 링크 제목
  subtitle?: string; // 보조 설명 문구
  url: string; // 목적지 URL
  category: "portfolio" | "blog" | "social" | "career" | "contact" | "store" | "community" | "etc";
  iconType: "globe" | "github" | "blog" | "mail" | "coffee" | "file-text" | "instagram" | "youtube" | "twitter" | "linkedin" | "discord" | "store" | "sparkles" | "link";
  iconBg?: string; // 아이콘 배경 HEX (예: "#E8F3FF")
  iconColor?: string; // 아이콘 전경 HEX (예: "#3182F6")
  badge?: string; // 강조 배지 텍스트 (예: "대표 링크", "1.5k Stars")
  isActive: boolean; // 노출 여부
  isPinned?: boolean; // 상단 고정 강조 여부
  displayOrder: number; // 노출 순서 번호
  clickCount: number; // 누적 클릭수 (통계)
  createdAt: string; // 생성 일시 (ISO 8601)
  updatedAt: string; // 수정 일시 (ISO 8601)
}

// 2. 프로필 및 테마 모델
interface UserProfile {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  role: string;
  location?: string;
  email?: string;
  viewsCount: number;
  socials?: Record<string, string>;
}

interface ProfileTheme {
  presetId: "toss" | "minimal" | "dark" | "vivid";
  backgroundColor?: string;
  buttonShape: "square" | "rounded" | "pill";
  buttonStyle: "fill" | "outline";
}

// 3. PRD 영속 데이터베이스 스키마: "mylink_profiles"
interface LocalDatabase {
  [handle: string]: {
    profile: UserProfile;
    theme: ProfileTheme;
    links: LinkItem[];
  };
}
```

---

### 5.2 내장 더미 데이터 (Seed & Mock Datasets)
프로젝트 내에서 클라이언트 로컬 스토리지 시드 및 Mock API로 바로 활용할 수 있는 더미 데이터셋이 구축되어 있습니다:

1. **정적 링크 목록 JSON (`src/data/links.json`)**
   - 개발자 페르소나(`@hong`)의 12종 고품질 링크 목록 수록:
     - 2026 포트폴리오 웹사이트 (`portfolio`, `globe`, 대표 링크)
     - 기술 블로그 (`blog`, `blog`, 매주 연재)
     - GitHub 오픈소스 저장소 (`community`, `github`, 1.5k Stars)
     - 이력서 및 경력기술서 (`career`, `file-text`, PDF)
     - 1:1 커피챗 신청하기 (`contact`, `coffee`, 30분 무료)
     - 비즈니스 및 외주 협업 문의 (`contact`, `mail`, 빠른 회신)
     - YouTube 코딩 채널 (`social`, `youtube`, 구독자 8.5k)
     - LinkedIn 프로필 (`career`, `linkedin`, 1촌 환영)
     - 디스코드 프론트엔드 스터디 (`community`, `discord`, 350+ 멤버)
     - 토스 디자인 시스템 발표 자료 (`blog`, `sparkles`, 슬라이드)
     - X(트위터) 테크 단상 (`social`, `twitter`, 팔로우)
     - 카카오톡 오픈채팅 (`contact`, `link`, 비활성화 예시)
2. **공개 직접 접근용 JSON (`public/mock/links.json`)**
   - 브라우저나 외부 도구에서 `GET /mock/links.json`으로 바로 fetch 가능
3. **통합 멀티 프로필 DB 시드 (`src/data/mock-database.json`)**
   - `@hong` (프론트엔드 엔지니어) + `@sujin` (일러스트레이터 겸 테크 크리에이터) 멀티 계정 프로필, 테마, 링크 일괄 수록

---

### 5.3 백엔드 Mock REST API 엔드포인트 명세
Next.js 16 App Router Route Handler 기반으로 프론트엔드 연동 테스트용 Mock REST API를 제공합니다:

| 메서드 | 엔드포인트 | 설명 및 파라미터 |
| :--- | :--- | :--- |
| `GET` | `/api/links` | 링크 목록 조회 (`handle`, `category`, `isActive`, `search`, `sortBy`, `page`, `limit`) |
| `POST` | `/api/links` | 새 링크 등록 (입력값 유효성 검사 및 자동 ID/타임스탬프 부여) |
| `GET` | `/api/links/:id` | 특정 링크 단건 상세 조회 |
| `PATCH` | `/api/links/:id` | 특정 링크 정보 수정 |
| `DELETE` | `/api/links/:id` | 특정 링크 삭제 |
| `POST` | `/api/links/:id/click` | 링크 클릭수 1 증가 트래킹 |
| `GET` | `/api/profile` | 기본 사용자(@hong)의 프로필, 테마, 링크 일괄 조회 |
| `GET` | `/api/profile/:handle` | 특정 핸들(@sujin 등)의 프로필, 테마, 링크 일괄 조회 |

#### 공통 응답 규격 (`ApiResponse<T>` / `PaginatedApiResponse<T>`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "링크 목록을 성공적으로 조회했습니다.",
  "data": [...],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-10-10T21:28:00.000Z"
}
```

---

### 5.4 클라이언트 Mock API 서비스 연동 (`src/lib/mock-api.ts`)
프론트엔드 컴포넌트에서 백엔드 API를 손쉽게 호출할 수 있는 유틸리티 함수를 제공하며, 오프라인 환경에서도 로컬 데이터로 안전하게 폴백(Fallback) 처리됩니다:
- `getLinks(params)`: 링크 목록 필터/검색/페이징 조회
- `getLinkById(id)`: 링크 단건 조회
- `createLink(input)`: 새 링크 생성
- `updateLink(id, input)`: 링크 수정
- `deleteLink(id)`: 링크 삭제
- `trackLinkClick(id)`: 링크 클릭수 집계
- `getProfileWithLinks(handle)`: 프로필 + 활성 링크 통합 조회

---

### 5.5 Zustand 전역 상태 스토어 설계 (Store Architecture)
- **`useSessionStore` (`mylink_session`)**:
  - `session`: 로그인한 사용자 정보 (`UserSession | null`)
  - `login(provider, handle)`: 시뮬레이션 로그인 및 세션 생성
  - `logout()`: 세션 초기화 및 로그아웃 처리
- **`useProfileStore` (`mylink_profiles`)**:
  - `profiles`: 핸들별 전체 프로필 맵 (`LocalDatabase`)
  - `currentHandle`: 현재 편집/조회 중인 핸들
  - `updateProfile(handle, data)`: 프로필 기본 정보 실시간 수정
  - `updateTheme(handle, theme)`: 테마 및 버튼 스타일 실시간 수정
  - `addLink(handle, link)` / `updateLink(handle, linkId, link)` / `deleteLink(handle, linkId)`: 링크 CRUD
  - `reorderLinks(handle, orderedLinkIds)`: 드래그 앤 드롭 순서 변경 반영
  - `trackClick(handle, linkId)` / `trackView(handle)`: 통계 수치 1 증가
  - `resetToMockData()`: 기본 Mock 데이터(@hong)로 전체 스토리지 리셋
- **실시간 프리뷰 최적화**:
  - 좌측 편집 패널과 우측 스마트폰 목업이 Zustand의 Selector(`useProfileStore(s => s.profiles[handle].profile.displayName)`)를 통해 세부 상태만 구독함으로써 불필요한 전체 리렌더링 없이 부드러운 타이핑 반응 속도(0ms 딜레이) 보장

---

## 6. 비기능 요구사항 (Non-Functional Requirements)

1. **완전한 클라이언트 독립성**
   - 네트워크 연결 없이도 오프라인/로컬 환경에서 전체 기능이 정상 동작
2. **반응형 최적화**
   - 모바일(320px~480px), 태블릿(768px), 데스크톱(1024px+) 전 구간에서 깨짐 없는 UI
3. **데이터 복구 및 초기화 (Reset)**
   - 설정 메뉴에 `[기본 Mock 데이터로 초기화]` 버튼을 제공하여 테스트 중 데이터가 꼬였을 때 언제든 원복 가능
4. **저장 용량 관리**
   - Base64 프로필 이미지는 캔버스 리사이징(최대 500x500px, JPEG 압축)을 거쳐 LocalStorage 용량(5MB) 초과 방지
5. **스타일링 및 컴포넌트 아키텍처 원칙 (Zero CSS Modules & shadcn/ui)**
   - CSS Modules(`.module.css`) 사용을 일체 금지하고 Tailwind CSS v4 단일 체계로 일관성 유지
   - 모든 UI는 shadcn/ui 기반 아토믹 프리미티브(`src/components/ui/*`)와 도메인 컴포넌트로 분리하여 재사용성 100% 보장

---

## 7. 향후 클라우드 DB(Supabase) 전환 계획 (Future Transition)

- **Repository 패턴 추상화**:
  - `storage-service.ts`에 `getProfile()`, `saveProfile()`, `getLinks()`, `saveLinks()`, `trackClick()` 인터페이스를 정의하여, 추후 로컬 스토리지 구현체를 Supabase 클라이언트로 1:1 교체 가능하도록 설계
