import { NextResponse } from "next/server";
import linksDataRaw from "@/data/links.json";
import type { LinkItem, ApiResponse } from "@/types/link";

let mockLinks: LinkItem[] = [...(linksDataRaw as LinkItem[])];

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/links/:id/click
 * 링크 클릭수 증가 트래킹 Mock API
 */
export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const link = mockLinks.find((item) => item.id === id);

    if (!link) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: `클릭수를 집계할 링크 (ID: '${id}')를 찾을 수 없습니다.`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    link.clickCount += 1;
    link.updatedAt = new Date().toISOString();

    const responsePayload: ApiResponse<{ id: string; clickCount: number }> = {
      success: true,
      statusCode: 200,
      message: "링크 클릭수가 성공적으로 집계되었습니다.",
      data: {
        id: link.id,
        clickCount: link.clickCount,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("POST /api/links/[id]/click 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "클릭수 집계 중 서버 내부 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
