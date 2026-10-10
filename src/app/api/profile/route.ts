import { NextResponse } from "next/server";
import mockDbRaw from "@/data/mock-database.json";
import type { LocalDatabase, UserDatabaseEntry, ApiResponse } from "@/types/link";

const mockDb: LocalDatabase = mockDbRaw as unknown as LocalDatabase;

/**
 * GET /api/profile
 * 기본 사용자(@hong)의 프로필 및 링크 목록, 테마 정보 반환
 */
export async function GET() {
  try {
    const entry: UserDatabaseEntry = mockDb["hong"];

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: "기본 프로필 정보를 찾을 수 없습니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const responsePayload: ApiResponse<UserDatabaseEntry> = {
      success: true,
      statusCode: 200,
      message: "기본 프로필 및 링크 정보를 성공적으로 조회했습니다.",
      data: entry,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("GET /api/profile 오류:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "프로필 조회 중 서버 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
