import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 토너먼트 참가 신청 목록 조회 (GET)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applications = await prisma.tournamentApplication.findMany({
      where: { tournamentId: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (e) {
    return NextResponse.json({ error: '신청 목록 조회 실패', detail: String(e) }, { status: 500 });
  }
}
