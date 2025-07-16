import { NextResponse } from 'next/server';
import { prisma } from '@/shared/prisma/client';

/**
 * 최근 1주일간 인기 스트리머 랭킹 API
 * - 시청자 수, 팔로워 수, 투표수 기준으로 인기 스트리머를 집계하여 반환
 * - 기본 정렬: 최근 1주일간 시청자 수(desc), 팔로워 수(desc), 투표수(desc)
 * - 프론트엔드 추천/랭킹 섹션 등에서 활용 가능
 */
export async function GET() {
  // 1주일 전 날짜 계산
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // 1. 최근 1주일간 방송을 진행한 스트리머 목록 조회
  // 2. 각 스트리머별 시청자 수, 팔로워 수, 투표수 집계
  // 3. 시청자 수(desc), 팔로워 수(desc), 투표수(desc) 순으로 정렬
  // 4. 상위 20명 반환
  const streamers = await prisma.user.findMany({
    where: {
      streamer: {}, // 스트리머만 ,streamer: null 스트리머 아닌 유저만
      streams: {
        some: {
          startedAt: { gte: weekAgo },
        },
      },
    },
    select: {
      id: true,
      nickname: true,
      profileImageUrl: true,
      // 최근 1주일간 방송의 시청 로그
      streams: {
        where: { startedAt: { gte: weekAgo } },
        select: {
          id: true,
          streamViewLogs: true, // 시청 로그
        },
      },
      // 최근 1주일간 팔로워
      followers: {
        where: { createdAt: { gte: weekAgo } },
        select: { id: true },
      },
      // 최근 1주일간 투표
      streamerVotes: {
        where: { createdAt: { gte: weekAgo } },
        select: { id: true },
      },
    },
  });

  // 집계 및 정렬
  const ranked = streamers
    .map((s) => {
      // 1주일간 시청자 수(중복 제거)
      const viewerSet = new Set<string>();
      s.streams.forEach((stream) => {
        stream.streamViewLogs.forEach((log) => viewerSet.add(log.userId));
      });
      const viewerCount = viewerSet.size;
      const followerCount = s.followers.length;
      const voteCount = s.streamerVotes.length;
      return {
        id: s.id,
        nickname: s.nickname,
        profileImageUrl: s.profileImageUrl,
        viewerCount,
        followerCount,
        voteCount,
      };
    })
    .sort((a, b) => {
      // 시청자 수 > 팔로워 수 > 투표수 순으로 내림차순 정렬
      if (b.viewerCount !== a.viewerCount) return b.viewerCount - a.viewerCount;
      if (b.followerCount !== a.followerCount) return b.followerCount - a.followerCount;
      return b.voteCount - a.voteCount;
    })
    .slice(0, 20); // 상위 20명

  return NextResponse.json(ranked);
}
