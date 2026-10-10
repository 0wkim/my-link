import { NextResponse } from "next/server";
import linksDataRaw from "@/data/links.json";
import type {
  LinkItem,
  LinkUpdateInput,
  ApiResponse,
} from "@/types/link";

let mockLinks: LinkItem[] = [...(linksDataRaw as LinkItem[])];

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/links/:id
 * 특정 링크 단건 상세 조회 Mock API
 */
export async function GET(
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
          message: `ID가 '${id}'인 링크를 찾을 수 없습니다.`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const responsePayload: ApiResponse<LinkItem> = {
      success: true,
      statusCode: 200,
      message: "링크 정보를 성공적으로 조회했습니다.",
      data: link,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("GET /api/links/[id] 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "링크 상세 조회 중 서버 내부 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/links/:id
 * 특정 링크 정보 수정 Mock API
 */
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const linkIndex = mockLinks.findIndex((item) => item.id === id);

    if (linkIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: `수정할 링크 (ID: '${id}')를 찾을 수 없습니다.`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const body = (await request.json()) as LinkUpdateInput;
    const existing = mockLinks[linkIndex];

    const updatedLink: LinkItem = {
      ...existing,
      ...body,
      id: existing.id, // ID는 변경 불가
      userHandle: existing.userHandle,
      updatedAt: new Date().toISOString(),
    };

    mockLinks[linkIndex] = updatedLink;

    const responsePayload: ApiResponse<LinkItem> = {
      success: true,
      statusCode: 200,
      message: "링크 정보가 성공적으로 수정되었습니다.",
      data: updatedLink,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/links/[id] 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "링크 수정 중 서버 내부 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/links/:id
 * 특정 링크 삭제 Mock API
 */
export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const linkIndex = mockLinks.findIndex((item) => item.id === id);

    if (linkIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: `삭제할 링크 (ID: '${id}')를 찾을 수 없습니다.`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const [deleted] = mockLinks.splice(linkIndex, 1);

    const responsePayload: ApiResponse<{ deletedId: string; title: string }> = {
      success: true,
      statusCode: 200,
      message: "링크가 성공적으로 삭제되었습니다.",
      data: {
        deletedId: deleted.id,
        title: deleted.title,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/links/[id] 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "링크 삭제 중 서버 내부 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
