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
    const { title, description, gameType, teamSize, formSchema, startDate, endDate } = body;
    if (!title || !gameType || !startDate || !endDate) {
      return NextResponse.json({ error: '필수 입력값 누락' }, { status: 400 });
    }
    console.log('body : ', body);
    // hostId는 세션의 ADMIN userId로 자동 지정
    const hostId = token.id as string;

    console.log('hostId : ', hostId);
    // hostId가 실제로 ADMIN인지 확인(이중 체크)
    const host = await prisma.user.findUnique({ where: { id: hostId } });
    console.log('host : ', host);
    if (!host || host.role !== 'ADMIN') {
      return NextResponse.json({ error: '주최자는 반드시 관리자여야 합니다.' }, { status: 403 });
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
        host: { connect: { id: hostId } },
      },
    });
    return NextResponse.json(tournament, { status: 201 });
  } catch (e) {
    console.log('e : ', e);
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
