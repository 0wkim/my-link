/**
 * 마이링크(MyLink) 링크 및 프로필 데이터 타입 정의
 * - PRD v1.3 및 백엔드 Mock REST API 응답 규격 준수
 */

export type LinkCategory =
  | "portfolio"
  | "blog"
  | "social"
  | "career"
  | "contact"
  | "store"
  | "community"
  | "etc";

export type IconType =
  | "globe"
  | "github"
  | "blog"
  | "mail"
  | "coffee"
  | "file-text"
  | "instagram"
  | "youtube"
  | "twitter"
  | "linkedin"
  | "discord"
  | "store"
  | "code"
  | "briefcase"
  | "sparkles"
  | "link";

export interface LinkItem {
  /** 링크 고유 식별자 (UUID 또는 slug) */
  id: string;
  /** 사용자 핸들 식별자 (예: "hong") */
  userHandle: string;
  /** 링크 제목 */
  title: string;
  /** 보조 설명 (선택) */
  subtitle?: string;
  /** 목적지 URL (http, https, mailto 등) */
  url: string;
  /** 링크 카테고리 */
  category: LinkCategory;
  /** 아이콘 식별자 */
  iconType: IconType;
  /** 아이콘 배경 색상 (Tailwind 클래스 또는 HEX) */
  iconBg?: string;
  /** 아이콘 텍스트/전경 색상 (Tailwind 클래스 또는 HEX) */
  iconColor?: string;
  /** 강조 배지 텍스트 (예: "대표 링크", "1.5k Stars", "NEW") */
  badge?: string;
  /** 링크 활성화(노출) 여부 */
  isActive: boolean;
  /** 상단 고정(하이라이트) 여부 */
  isPinned?: boolean;
  /** 정렬 순서 (낮을수록 상단 노출) */
  displayOrder: number;
  /** 누적 클릭수 (통계/분석용) */
  clickCount: number;
  /** 생성 일시 (ISO 8601) */
  createdAt: string;
  /** 최종 수정 일시 (ISO 8601) */
  updatedAt: string;
}

export interface LinkCreateInput {
  title: string;
  url: string;
  subtitle?: string;
  category?: LinkCategory;
  iconType?: IconType;
  iconBg?: string;
  iconColor?: string;
  badge?: string;
  isActive?: boolean;
  isPinned?: boolean;
  displayOrder?: number;
}

export interface LinkUpdateInput extends Partial<LinkCreateInput> {
  clickCount?: number;
}

export interface UserProfile {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  role: string;
  location?: string;
  email?: string;
  viewsCount: number;
  socials?: {
    github?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface ProfileTheme {
  presetId: "toss" | "minimal" | "dark" | "vivid";
  backgroundColor?: string;
  buttonShape: "square" | "rounded" | "pill";
  buttonStyle: "fill" | "outline";
}

/** PRD LocalStorage Database 스키마 규격 */
export interface UserDatabaseEntry {
  profile: UserProfile;
  theme: ProfileTheme;
  links: LinkItem[];
}

export interface LocalDatabase {
  [handle: string]: UserDatabaseEntry;
}

/**
 * 백엔드 Mock REST API 공통 표준 응답 인터페이스
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
