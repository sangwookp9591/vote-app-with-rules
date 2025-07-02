import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

// 토너먼트 생성 (POST)
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.role || token.role !== 'ADMIN') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }
  try {
    const body = await req.json();
    console.log('body :', body);

    const { title, description, gameType, teamSize, formSchema, startDate, endDate, streamerId } =
      body;
    if (!title || !gameType || !startDate || !endDate || !streamerId) {
      return NextResponse.json({ error: '필수 입력값 누락' }, { status: 400 });
    }
    // streamerId는 실제로 userId이므로, 해당 user의 streamer를 찾아서 연결
    const streamer = await prisma.streamer.findUnique({
      where: { userId: streamerId },
    });

    if (!streamer) {
      return NextResponse.json({ error: '스트리머를 찾을 수 없습니다.' }, { status: 404 });
    }

    const tournament = await prisma.tournament.create({
      data: {
        title,
        description,
        gameType,
        teamSize: teamSize || 5, // 기본값 5명
        formSchema,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        streamer: { connect: { id: streamer.id } },
      },
    });
    return NextResponse.json(tournament, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: '토너먼트 생성 실패', detail: String(e) }, { status: 500 });
  }
}

// 토너먼트 목록 조회 (GET)
export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        gameType: true,
        teamSize: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        formSchema: true,
      },
    });
    return NextResponse.json(tournaments);
  } catch (e) {
    return NextResponse.json(
      { error: '토너먼트 목록 조회 실패', detail: String(e) },
      { status: 500 },
    );
  }
}
