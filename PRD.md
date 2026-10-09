# [PRD] 마이링크 (MyLink) 제품 기능 정의서 (LocalStorage & Mock 데이터 기반)

> **문서 버전**: v1.2.0 (Phase 1: LocalStorage 프로필 페이지 중심 마일스톤 분리)  
> **최종 수정 일자**: 2026-10-09  
> **상태**: 승인됨 (Approved)  
> **아키텍처**: 서버리스 클라이언트 사이드 (Local-First Architecture, Zustand & LocalStorage Mock 연동)  
> **기본 기술 스택**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Zustand

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
- ⏳ **Phase 2 (차기 마일스톤 - 관리 도구 및 통계)**
  - 관리자 대시보드 (`/admin`) 및 실시간 모바일 목업 프리뷰 에디터
  - 링크 CRUD (추가/수정/삭제/토글) 및 드래그 앤 드롭 순서 변경
  - 테마 커스터마이저 (배경색, 버튼 라운딩, 외곽선 스타일)
  - 통계 기능 (`/admin/analytics` - 방문자 수, 링크별 누적 클릭수, CTR 분석)
  - Mock 소셜 간편 로그인 (`/login`)

### 1.3 핵심 가치 제안 (Value Proposition)
1. **Zero-Config 즉시 실행**: DB나 API 서버 설정 없이 `npm run dev`만으로 브라우저에서 즉시 동작
2. **영속적 로컬 스토리지 (LocalStorage)**: 브라우저를 새로고침하거나 재방문해도 로컬에 저장된 프로필, 링크, 테마가 그대로 유지
3. **토스 디자인 시스템 (TDS) 기반 완성도**: 모바일 및 데스크톱 전 구간에서 깨짐 없는 깔끔하고 직관적인 UX
4. **Mock 기반 멀티 핸들 지원**: 기본 샘플 계정(`@hong`) 제공 및 로컬 스토리지 키 기반 데이터 조회

### 1.4 핵심 사용자 시나리오 (User Scenarios)

> 모든 시나리오는 **"사용자는 ___ 하기 위해 ___ 한다"** 형식으로 단계별 흐름을 정의합니다.

#### 1. 방문자 관점: 다른 사람의 마이링크 페이지를 방문하는 과정
- **1단계 (접속)**: 사용자는 관심 있는 크리에이터의 전체 채널 및 작업물을 한눈에 확인하기 위해 SNS(인스타그램, 유튜브 등) 프로필 바이오에 등록된 마이링크 URL(`/@hong`)을 클릭한다.
- **2단계 (프로필 탐색)**: 사용자는 해당 페이지의 주인이 본인이 찾던 인물이 맞는지 식별하기 위해 상단의 프로필 사진, 닉네임, 한 줄 소개글을 확인한다.
- **3단계 (링크 카드 탐색)**: 사용자는 자신이 방문하고자 하는 채널(포트폴리오, 블로그, GitHub 등)을 찾기 위해 리스트 형태로 나열된 링크 카드들의 제목, 아이콘, 설명을 스크롤하며 살펴본다.
- **4단계 (링크 이동)**: 사용자는 관심 있는 목적지 콘텐츠(예: 최신 기술 블로그 글)로 넘어가기 위해 해당 링크 카드를 터치/클릭하여 새 탭으로 안전하게 이동한다.
- **5단계 (페이지 공유)**: 사용자는 해당 크리에이터의 프로필을 친구나 지인에게 추천하기 위해 우측 상단의 [공유] 버튼을 눌러 링크 주소를 클립보드에 복사한다.

#### 2. 소유자 관점: 자신의 마이링크를 관리하는 과정 (링크 추가, 수정, 삭제)
- **1단계 (관리자 진입)**: 사용자는 자신의 링크인바이오 페이지를 편집하기 위해 마이링크 관리자 페이지(`/admin/links`)에 접속한다.
- **2단계 (링크 추가)**:
  - 사용자는 새로운 프로젝트나 소셜 계정을 프로필에 노출하기 위해 `[+ 새 링크 추가]` 버튼을 클릭한다.
  - 사용자는 방문자에게 명확한 이동 경로를 제공하기 위해 링크 제목(Title), 목적지 URL, 대표 아이콘을 입력한다.
  - 사용자는 등록된 링크가 실제 모바일 환경에서 어색하지 않은지 검증하기 위해 우측 실시간 모바일 목업 화면을 확인한다.
- **3단계 (링크 수정)**:
  - 사용자는 오타를 수정하거나 변경된 웹사이트 주소를 갱신하기 위해 기존 링크 카드의 입력 필드를 선택하여 텍스트 및 URL을 수정한다.
  - 사용자는 특정 링크를 일시적으로 방문자에게 숨기기 위해 해당 카드의 `활성화/비활성화(ON/OFF)` 스위치를 토글한다.
  - 사용자는 가장 중요한 링크를 방문자 시선의 최상단에 배치하기 위해 드래그 핸들을 잡고 위아래로 끌어서 카드의 순서를 재배치한다.
- **4단계 (링크 삭제)**:
  - 사용자는 더 이상 운영하지 않거나 불필요해진 링크를 정리하기 위해 링크 카드의 `[삭제]`(휴지통) 아이콘을 클릭한다.
  - 사용자는 중요한 링크가 실수로 제거되는 것을 방지하기 위해 화면에 나타난 삭제 확인 안내창에서 최종 삭제를 승인한다.
- **5단계 (저장 및 반영 확인)**:
  - 사용자는 변경된 전체 링크 목록을 브라우저를 재접속해도 유지하기 위해 로컬 스토리지(`LocalStorage`)에 자동 저장되도록 상태를 갱신하고, 자신의 공개 프로필 페이지 링크를 열어 정상 반영을 최종 점검한다.

---

## 2. 시스템 아키텍처 및 기술 스택

| 영역 | 기술 스택 | 세부 구현 방식 |
| :--- | :--- | :--- |
| **프레임워크** | **Next.js 16 (App Router)** | 클라이언트 컴포넌트 기반 상태 관리 및 dynamic route(`/@:username`) |
| **라이브러리** | **React 19** | `useTransition`, `useState`, Context API를 활용한 반응형 상태 동기화 |
| **언어** | **TypeScript 5.8+** | 데이터 스키마 타입 안전성 보장 (`Profile`, `LinkItem`, `ThemeConfig` 등) |
| **스타일링** | **Tailwind CSS v4** | 모바일 퍼스트 반응형 레이아웃 및 테마별 유틸리티 스타일링 |
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
- **FR-1.4 토스 TDS 스타일 및 반응형 최적화**
  - 토스 디자인 시스템(TDS) 가이드라인(그레이스케일, 토스 블루 포인트, 카드 라운딩) 적용
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

## 5. 로컬 데이터 모델 (LocalStorage Schema)

브라우저 `localStorage`에 저장되는 단일 또는 키 기반 데이터 모델:

```typescript
// 1. 세션 키: "mylink_session"
interface UserSession {
  userId: string;
  email: string;
  name: string;
  handle: string; // 현재 관리 중인 핸들 (예: "hong")
  provider: "google" | "kakao" | "demo";
}

// 2. 프로필 및 링크 저장소 키: "mylink_profiles"
interface LocalDatabase {
  [handle: string]: {
    profile: {
      handle: string;
      displayName: string;
      bio: string;
      avatarUrl: string; // URL 또는 Base64 DataURL
      viewsCount: number;
    };
    theme: {
      presetId: "toss" | "minimal" | "dark" | "vivid";
      backgroundColor?: string;
      buttonShape: "square" | "rounded" | "pill";
      buttonStyle: "fill" | "outline";
    };
    links: Array<{
      id: string;
      title: string;
      url: string;
      iconType?: string;
      isActive: boolean;
      displayOrder: number;
      clickCount: number;
      createdAt: string;
    }>;
  };
}
```

### 초기 내장 Mock 데이터 (Seed Data)
앱 최초 실행 시 `localStorage`에 데이터가 없을 경우 자동으로 주입되는 기본 데이터:
- **핸들**: `@hong`
- **표시 이름**: `홍길동`
- **한 줄 소개**: `복잡한 문제를 단순하고 직관적인 화면으로 해결하는 프론트엔드 엔지니어예요.`
- **기본 링크 4개**:
  1. 포트폴리오 웹사이트 (`https://example.com/portfolio`)
  2. 기술 블로그 (`https://example.com/blog`)
  3. GitHub 저장소 (`https://github.com`)
  4. 커피챗 신청 (`mailto:hong@example.com`)
- **기본 테마**: `toss` (토스 스타일)

### 5.2 Zustand 전역 상태 스토어 설계 (Store Architecture)
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

---

## 7. 향후 클라우드 DB(Supabase) 전환 계획 (Future Transition)

- **Repository 패턴 추상화**:
  - `storage-service.ts`에 `getProfile()`, `saveProfile()`, `getLinks()`, `saveLinks()`, `trackClick()` 인터페이스를 정의하여, 추후 로컬 스토리지 구현체를 Supabase 클라이언트로 1:1 교체 가능하도록 설계
