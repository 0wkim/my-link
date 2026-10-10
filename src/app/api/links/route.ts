import { NextResponse } from "next/server";
import linksDataRaw from "@/data/links.json";
import type {
  LinkItem,
  LinkCreateInput,
  PaginatedApiResponse,
  ApiResponse,
  LinkCategory,
} from "@/types/link";

// 메모리 상의 Mock 데이터 저장소 (서버 라이프사이클 동안 변경 반영 시뮬레이션 가능)
const mockLinks: LinkItem[] = [...(linksDataRaw as LinkItem[])];

/**
 * GET /api/links
 * 링크 목록 조회 Mock API
 * - 쿼리 파라미터 지원:
 *   - handle: 사용자 핸들 필터 (기본: "hong")
 *   - category: 카테고리 필터
 *   - isActive: 활성화 여부 ("true" | "false")
 *   - search: 제목/설명/URL 검색어
 *   - sortBy: "order" | "clicks" | "recent" (기본: "order")
 *   - page: 페이지 번호 (기본 1)
 *   - limit: 페이지당 항목 수 (기본 10)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const handle = searchParams.get("handle") || "hong";
    const category = searchParams.get("category") as LinkCategory | null;
    const isActiveParam = searchParams.get("isActive");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const sortBy = searchParams.get("sortBy") || "order";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));

    // 1. 필터링
    const filtered = mockLinks.filter((item) => {
      // 핸들 필터
      if (item.userHandle && item.userHandle !== handle) return false;

      // 카테고리 필터
      if (category && item.category !== category) return false;

      // 활성화 여부 필터
      if (isActiveParam !== null && isActiveParam !== undefined) {
        const isActiveBool = isActiveParam === "true";
        if (item.isActive !== isActiveBool) return false;
      }

      // 검색어 필터
      if (search) {
        const inTitle = item.title.toLowerCase().includes(search);
        const inSubtitle = item.subtitle?.toLowerCase().includes(search) ?? false;
        const inUrl = item.url.toLowerCase().includes(search);
        if (!inTitle && !inSubtitle && !inUrl) return false;
      }

      return true;
    });

    // 2. 정렬
    filtered.sort((a, b) => {
      if (sortBy === "clicks") {
        return b.clickCount - a.clickCount;
      }
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // 기본 정렬: displayOrder 오름차순 (isPinned 우선)
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return a.displayOrder - b.displayOrder;
    });

    // 3. 페이지네이션
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    const responsePayload: PaginatedApiResponse<LinkItem> = {
      success: true,
      statusCode: 200,
      message: "링크 목록을 성공적으로 조회했습니다.",
      data: paginatedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("GET /api/links 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "링크 목록 조회 중 서버 내부 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/links
 * 신규 링크 추가 Mock API
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LinkCreateInput;

    // 유효성 검사
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "링크 제목(title)은 필수 입력값입니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (!body.url || !body.url.trim()) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "링크 URL(url)은 필수 입력값입니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newId = `link-${Date.now().toString(36)}`;

    // 새 링크 객체 조립
    const newLink: LinkItem = {
      id: newId,
      userHandle: "hong",
      title: body.title.trim(),
      subtitle: body.subtitle?.trim(),
      url: body.url.trim(),
      category: body.category || "portfolio",
      iconType: body.iconType || "globe",
      iconBg: body.iconBg || "#E8F3FF",
      iconColor: body.iconColor || "#3182F6",
      badge: body.badge?.trim(),
      isActive: body.isActive ?? true,
      isPinned: body.isPinned ?? false,
      displayOrder: body.displayOrder ?? mockLinks.length + 1,
      clickCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    mockLinks.push(newLink);

    const responsePayload: ApiResponse<LinkItem> = {
      success: true,
      statusCode: 201,
      message: "새 링크가 성공적으로 등록되었습니다.",
      data: newLink,
      timestamp: now,
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error) {
    console.error("POST /api/links 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "링크 등록 중 서버 내부 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
