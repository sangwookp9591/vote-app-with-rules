import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 토너먼트 참가 신청 목록 조회 (GET)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const applications = await prisma.tournamentApplication.findMany({
      where: { tournamentId: id },
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

// 토너먼트 참가 신청 생성 (POST)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { userId, gameData } = body;

    if (!userId || !gameData) {
      return NextResponse.json({ error: 'userId와 gameData는 필수입니다.' }, { status: 400 });
    }

    const application = await prisma.tournamentApplication.create({
      data: {
        tournamentId: id,
        userId,
        gameData,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: '신청 생성 실패', detail: String(e) }, { status: 500 });
  }
}
