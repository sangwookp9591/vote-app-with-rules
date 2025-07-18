import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/prisma/client';

// 개인화 추천 API
export async function GET(req: NextRequest) {
  // userId 쿼리 파라미터로 받기
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
  }

  // 최근 2주 기준
  const since = new Date();
  since.setDate(since.getDate() - 14);

  // 1. 최근 시청 로그 집계 (가장 많이 본 스트리머)
  const viewLogs = await prisma.streamViewLog.findMany({
    where: { userId, enteredAt: { gte: since } },
    include: { stream: true },
  });
  const viewCountByStreamer: Record<string, number> = {};
  viewLogs.forEach((log) => {
    const streamerId = log.stream.streamerId;
    viewCountByStreamer[streamerId] = (viewCountByStreamer[streamerId] || 0) + 1;
  });

  // 2. 최근 채팅 로그 집계 (가장 많이 채팅한 스트리머)
  const chatLogs = await prisma.chatLog.findMany({
    where: { userId, sentAt: { gte: since } },
    include: { stream: true },
  });
  const chatCountByStreamer: Record<string, number> = {};
  chatLogs.forEach((log) => {
    const streamerId = log.stream.streamerId;
    chatCountByStreamer[streamerId] = (chatCountByStreamer[streamerId] || 0) + 1;
  });

  // 3. 최근 팔로우/투표 집계
  const follows = await prisma.follower.findMany({
    where: { userId, createdAt: { gte: since } },
  });
  const votes = await prisma.streamerVote.findMany({
    where: { userId, createdAt: { gte: since } },
  });

  // 추천 점수 집계 (시청 2점, 채팅 2점, 팔로우 3점, 투표 3점)
  const scoreByStreamer: Record<string, number> = {};
  for (const streamerId in viewCountByStreamer) {
    scoreByStreamer[streamerId] =
      (scoreByStreamer[streamerId] || 0) + viewCountByStreamer[streamerId] * 2;
  }
  for (const streamerId in chatCountByStreamer) {
    scoreByStreamer[streamerId] =
      (scoreByStreamer[streamerId] || 0) + chatCountByStreamer[streamerId] * 2;
  }
  follows.forEach((f) => {
    scoreByStreamer[f.streamerId] = (scoreByStreamer[f.streamerId] || 0) + 3;
  });
  votes.forEach((v) => {
    scoreByStreamer[v.streamerId] = (scoreByStreamer[v.streamerId] || 0) + 3;
  });

  // 점수순 정렬, 상위 10명 추천
  const sorted = Object.entries(scoreByStreamer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // 추천 결과 + 추천 이유 생성
  const recommended = await Promise.all(
    sorted.map(async ([streamerId, score]) => {
      // 스트리머 정보
      const streamer = await prisma.user.findUnique({ where: { id: streamerId } });
      // 추천 이유 생성
      let reason = '';
      if (viewCountByStreamer[streamerId] && chatCountByStreamer[streamerId]) {
        reason = '최근 시청과 채팅이 모두 활발했던 스트리머';
      } else if (viewCountByStreamer[streamerId]) {
        reason = '최근 시청이 많았던 스트리머';
      } else if (chatCountByStreamer[streamerId]) {
        reason = '최근 채팅이 많았던 스트리머';
      } else if (follows.find((f) => f.streamerId === streamerId)) {
        reason = '최근 팔로우한 스트리머';
      } else if (votes.find((v) => v.streamerId === streamerId)) {
        reason = '최근 투표한 스트리머';
      }
      return {
        streamerId,
        nickname: streamer?.nickname,
        profileImageUrl: streamer?.profileImageUrl,
        score,
        reason,
      };
    }),
  );

  return NextResponse.json({ recommended });
}
