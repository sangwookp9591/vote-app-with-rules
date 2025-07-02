import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 스트리머 신청 목록 조회
export async function GET() {
  try {
    const applications = await prisma.streamerApplication.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('applications: ', applications);

    return NextResponse.json(applications);
  } catch (error) {
    console.error('스트리머 신청 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '스트리머 신청 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 스트리머 신청 승인/거절
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, action, reviewerId } = body; // action: 'approve' | 'reject'

    if (!applicationId || !action || !reviewerId) {
      return NextResponse.json({ error: '필수 입력값 누락' }, { status: 400 });
    }

    const application = await prisma.streamerApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json({ error: '신청을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (action === 'approve') {
      // 승인 처리
      await prisma.$transaction(async (tx) => {
        // 신청 상태 업데이트
        await tx.streamerApplication.update({
          where: { id: applicationId },
          data: {
            status: 'APPROVED',
            reviewerId,
          },
        });

        // 스트리머 생성
        await tx.streamer.create({
          data: {
            userId: application.userId,
          },
        });
      });

      return NextResponse.json({ message: '스트리머 신청이 승인되었습니다.' });
    } else if (action === 'reject') {
      // 거절 처리
      await prisma.streamerApplication.update({
        where: { id: applicationId },
        data: {
          status: 'REJECTED',
          reviewerId,
        },
      });

      return NextResponse.json({ message: '스트리머 신청이 거절되었습니다.' });
    } else {
      return NextResponse.json({ error: '잘못된 액션입니다.' }, { status: 400 });
    }
  } catch (error) {
    console.error('스트리머 신청 처리 오류:', error);
    return NextResponse.json(
      { error: '스트리머 신청 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
