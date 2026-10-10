import { NextResponse } from "next/server";
import mockDbRaw from "@/data/mock-database.json";
import type { LocalDatabase, UserDatabaseEntry, ApiResponse } from "@/types/link";

const mockDb: LocalDatabase = mockDbRaw as unknown as LocalDatabase;

interface RouteContext {
  params: Promise<{ handle: string }>;
}

/**
 * GET /api/profile/:handle
 * 특정 핸들(예: hong, sujin)의 프로필, 링크 목록, 테마 조회 Mock API
 */
export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { handle } = await params;
    // URL 디코딩 및 '@' 접두사 제거 처리 (@hong -> hong)
    const normalizedHandle = decodeURIComponent(handle).replace(/^@/, "");

    const entry: UserDatabaseEntry | undefined = mockDb[normalizedHandle];

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: `핸들이 '@${normalizedHandle}'인 사용자를 찾을 수 없습니다.`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const responsePayload: ApiResponse<UserDatabaseEntry> = {
      success: true,
      statusCode: 200,
      message: `'@${normalizedHandle}' 사용자의 프로필 및 링크 정보를 성공적으로 조회했습니다.`,
      data: entry,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("GET /api/profile/[handle] 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "핸들 프로필 조회 중 서버 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
