import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/prisma/client';

/**
 * 다양성 추천 API (내가 한 번도 안 본 스트리머 중 평점/시청자 수 높은 순)
 * - 로그인 유저 기준, 시청 로그에 없는 스트리머만 추천
 * - 평점(투표), 시청자 수 등 기준으로 정렬
 */
export async function GET(req: NextRequest) {
  // TODO 1: 로그인 유저 정보 추출 (예: 세션/토큰)
  // const userId = ...;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return;
  try {
    // TODO 2: 내가 시청한 방송의 스트리머 ID 목록 구하기
    // streamViewLog에서 userId가 나와 같은 row만 필터링, stream.streamerId만 추출
    const watched = await prisma.streamViewLog.findMany({
      where: { userId },
      select: { stream: { select: { streamerId: true } } },
    });

    // TODO 3: 시청한 스트리머 ID 배열로 변환
    const watchedIds = watched.map((log) => log.stream.streamerId);

    // TODO 4: 한 번도 안 본 스트리머만 조회 (notIn)
    // - streamer: {}로 스트리머만
    // - id: { notIn: watchedIds }로 내가 본 적 없는 스트리머만
    // - select에서 평점(투표 수), 최근 1주일간 시청자 수 집계 필드 포함
    // - orderBy로 정렬(투표 수, 시청자 수 등)
    // - 응답은 프론트엔드 타입(PopularStreamer 등)에 맞게 가공

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const streamers = await prisma.user.findMany({
      where: {
        streamer: {},
        id: { notIn: watchedIds },
      },
      // TODO: select, orderBy, 집계/정렬 후 응답 가공
      select: {
        id: true,
        nickname: true,
        _count: {
          select: {
            streamerVotes: true,
          },
        },
        streams: {
          where: {
            createdAt: { gte: oneWeekAgo },
          },
          select: {
            streamViewLogs: {
              select: { userId: true },
            },
          },
        },
      },
      orderBy: {
        streamerVotes: {
          _count: 'desc',
        },
      },
    });
    // TODO 5: 집계/정렬 후 응답 가공 (예: 투표 수, 시청자 수 합산, 정렬 등)
    const result = streamers.map((s) => {
      // 최근 1주일간 모든 방송의 시청자 userId를 한 배열로 합침
      const allViewers = s.streams.flatMap((stream) =>
        stream.streamViewLogs.map((log) => log.userId),
      );
      // Set으로 중복 제거(유니크 시청자 수)
      const recentViewerCount = new Set(allViewers).size;
      return {
        id: s.id,
        nickname: s.nickname,
        voteCount: s._count.streamerVotes,
        recentViewerCount, // 최근 1주일간 유니크 시청자 수
      };
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: '알림 읽음 처리 실패', detail: String(e) }, { status: 500 });
  }
}
