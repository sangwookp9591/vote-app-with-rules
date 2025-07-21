import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// userId로 해당 사용자의 모든 방송(Stream) 정보를 조회하는 API
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  // userId가 없으면 400 에러 반환
  if (!userId) {
    return NextResponse.json({ error: 'userId 파라미터가 필요합니다.' }, { status: 400 });
  }

  try {
    // Prisma로 userId에 해당하는 모든 Stream 조회
    const streams = await prisma.stream.findMany({
      where: { streamerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    // 결과가 없으면 빈 배열 반환
    return NextResponse.json(streams);
  } catch (err) {
    // 에러 발생 시 500 에러 반환
    return NextResponse.json(
      { error: '방송 정보 조회 실패', detail: String(err) },
      { status: 500 },
    );
  }
}
