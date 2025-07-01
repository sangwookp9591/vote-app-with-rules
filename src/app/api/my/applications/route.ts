import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 내 참가 신청 내역 조회 (GET)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId 쿼리 파라미터가 필요합니다.' }, { status: 400 });
    }
    const applications = await prisma.tournamentApplication.findMany({
      where: { userId },
      include: {
        tournament: {
          select: {
            id: true,
            title: true,
            gameType: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (e) {
    return NextResponse.json(
      { error: '내 신청 내역 조회 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
