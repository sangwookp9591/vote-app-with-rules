import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/prisma/client';

/**
 * 다양성 추천 API (내가 한 번도 안 본 스트리머 중 평점/시청자 수 높은 순)
 * - 로그인 유저 기준, 시청 로그에 없는 스트리머만 추천
 * - 평점(투표), 시청자 수 등 기준으로 정렬
 * - TODO: 실제 쿼리/로직 구현 필요
 */
export async function GET(req: NextRequest) {
  // TODO: 로그인 유저 정보 추출 (예: 세션/토큰)
  // const userId = ...;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return;
  try {
    const watched = await prisma.streamViewLog.findMany({
      where: { userId },
      select: { stream: { select: { streamerId: true } } },
    });

    const watchedIds = watched.map((log) => log.stream.streamerId);

    // TODO: 내가 한 번도 안 본 스트리머 목록 쿼리
    // const streamers = await prisma.user.findMany({ ... });
    const streamers = await prisma.user.findMany({
      where: {
        streamer: {},
        id: { notIn: watchedIds },
      },
    });
    return NextResponse.json(streamers);
  } catch (e) {
    return NextResponse.json({ error: '알림 읽음 처리 실패', detail: String(e) }, { status: 500 });
  }
}
