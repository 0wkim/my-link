/**
 * 마이링크(MyLink) Mock API 클라이언트 라이브러리
 * - 프론트엔드 컴포넌트 또는 서비스에서 백엔드 API를 손쉽게 호출할 수 있는 헬퍼
 * - 네트워크 장애 시 fallback으로 로컬 JSON 데이터를 반환하도록 구현
 */

import type {
  LinkItem,
  LinkCreateInput,
  LinkUpdateInput,
  PaginatedApiResponse,
  ApiResponse,
  UserDatabaseEntry,
  LinkCategory,
} from "@/types/link";
import fallbackLinksRaw from "@/data/links.json";
import fallbackDbRaw from "@/data/mock-database.json";

export interface FetchLinksParams {
  handle?: string;
  category?: LinkCategory;
  isActive?: boolean;
  search?: string;
  sortBy?: "order" | "clicks" | "recent";
  page?: number;
  limit?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * 1. 링크 목록 조회 (필터, 검색, 정렬, 페이지네이션)
 */
export async function getLinks(
  params: FetchLinksParams = {}
): Promise<PaginatedApiResponse<LinkItem>> {
  const query = new URLSearchParams();
  if (params.handle) query.set("handle", params.handle);
  if (params.category) query.set("category", params.category);
  if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  try {
    const res = await fetch(`${BASE_URL}/api/links?${query.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Mock API fetch 실패, 로컬 폴백 데이터 반환:", error);
    const links = fallbackLinksRaw as LinkItem[];
    return {
      success: true,
      statusCode: 200,
      message: "[Fallback] 로컬 정적 데이터 반환",
      data: links,
      pagination: {
        total: links.length,
        page: 1,
        limit: links.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 2. 특정 링크 단건 상세 조회
 */
export async function getLinkById(id: string): Promise<ApiResponse<LinkItem>> {
  const res = await fetch(`${BASE_URL}/api/links/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`링크를 불러오지 못했습니다. (ID: ${id})`);
  }

  return await res.json();
}

/**
 * 3. 신규 링크 생성
 */
export async function createLink(
  input: LinkCreateInput
): Promise<ApiResponse<LinkItem>> {
  const res = await fetch(`${BASE_URL}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("링크 생성에 실패했습니다.");
  }

  return await res.json();
}

/**
 * 4. 링크 정보 수정
 */
export async function updateLink(
  id: string,
  input: LinkUpdateInput
): Promise<ApiResponse<LinkItem>> {
  const res = await fetch(`${BASE_URL}/api/links/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`링크 수정에 실패했습니다. (ID: ${id})`);
  }

  return await res.json();
}

/**
 * 5. 링크 삭제
 */
export async function deleteLink(
  id: string
): Promise<ApiResponse<{ deletedId: string; title: string }>> {
  const res = await fetch(`${BASE_URL}/api/links/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`링크 삭제에 실패했습니다. (ID: ${id})`);
  }

  return await res.json();
}

/**
 * 6. 링크 클릭수 트래킹 (1 증가)
 */
export async function trackLinkClick(
  id: string
): Promise<ApiResponse<{ id: string; clickCount: number }>> {
  try {
    const res = await fetch(`${BASE_URL}/api/links/${id}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (error) {
    console.error("클릭 트래킹 실패:", error);
    return {
      success: false,
      statusCode: 500,
      message: "트래킹 실패",
      data: { id, clickCount: 0 },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 7. 프로필 및 활성화된 링크 통합 조회
 */
export async function getProfileWithLinks(
  handle: string = "hong"
): Promise<ApiResponse<UserDatabaseEntry>> {
  try {
    const res = await fetch(`${BASE_URL}/api/profile/${handle}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`프로필 조회 실패: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("프로필 API 호출 실패, 폴백 데이터 반환:", error);
    const db = fallbackDbRaw as Record<string, UserDatabaseEntry>;
    const entry = db[handle] || db["hong"];
    return {
      success: true,
      statusCode: 200,
      message: "[Fallback] 로컬 프로필 데이터 반환",
      data: entry,
      timestamp: new Date().toISOString(),
    };
  }
}
