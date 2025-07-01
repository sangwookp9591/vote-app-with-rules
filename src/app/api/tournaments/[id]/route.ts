import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 토너먼트 상세 조회 (GET)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        applications: true,
      },
    });
    if (!tournament) {
      return NextResponse.json({ error: '토너먼트를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(tournament);
  } catch (e) {
    return NextResponse.json(
      { error: '토너먼트 상세 조회 실패', detail: String(e) },
      { status: 500 },
    );
  }
}

// 토너먼트 참가 신청 (POST)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { userId, gameData } = body;
    if (!userId || !gameData) {
      return NextResponse.json({ error: '필수 입력값 누락' }, { status: 400 });
    }
    // 이미 신청한 경우 중복 방지(옵션)
    const exists = await prisma.tournamentApplication.findFirst({
      where: { tournamentId: params.id, userId },
    });
    if (exists) {
      return NextResponse.json({ error: '이미 신청한 토너먼트입니다.' }, { status: 409 });
    }
    const application = await prisma.tournamentApplication.create({
      data: {
        tournamentId: params.id,
        userId,
        gameData,
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: '토너먼트 참가 신청 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
