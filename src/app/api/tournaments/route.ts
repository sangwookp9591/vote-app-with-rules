import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 토너먼트 생성 (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, gameType, formSchema, startDate, endDate, streamerId } = body;
    if (!title || !gameType || !startDate || !endDate || !streamerId) {
      return NextResponse.json({ error: '필수 입력값 누락' }, { status: 400 });
    }
    const tournament = await prisma.tournament.create({
      data: {
        title,
        description,
        gameType,
        formSchema,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        streamer: { connect: { id: streamerId } },
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
