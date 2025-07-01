import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 사용자 목록 조회 (GET)
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        email: true,
        profileImageUrl: true,
      },
      orderBy: { nickname: 'asc' },
    });
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json(
      { error: '사용자 목록 조회 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
