import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 스트리머 신청 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: '사용자 ID가 필요합니다.' }, { status: 400 });
    }

    // 이미 신청한 사용자인지 확인
    const existingApplication = await prisma.streamerApplication.findUnique({
      where: { userId },
    });

    if (existingApplication) {
      return NextResponse.json({ error: '이미 스트리머 신청을 하셨습니다.' }, { status: 400 });
    }

    // 이미 스트리머인지 확인
    const existingStreamer = await prisma.streamer.findUnique({
      where: { userId },
    });

    if (existingStreamer) {
      return NextResponse.json({ error: '이미 스트리머입니다.' }, { status: 400 });
    }

    // 스트리머 신청 생성
    const application = await prisma.streamerApplication.create({
      data: {
        userId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('스트리머 신청 생성 오류:', error);
    return NextResponse.json(
      { error: '스트리머 신청 생성 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 사용자의 스트리머 신청 상태 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: '사용자 ID가 필요합니다.' }, { status: 400 });
    }

    const application = await prisma.streamerApplication.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('스트리머 신청 상태 조회 오류:', error);
    return NextResponse.json(
      { error: '스트리머 신청 상태 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
