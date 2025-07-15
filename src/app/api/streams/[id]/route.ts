import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../shared/prisma/client';
import { getRedis } from '@/shared/redisClient';

// 방송방 상세 조회
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stream = await prisma.stream.findUnique({
    where: { id },
    include: { streamer: { select: { id: true, nickname: true, profileImageUrl: true } } },
  });
  if (!stream) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(stream);
}

// 방송 시작/종료, 시청자 수 갱신
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  // isLive, endedAt, viewers 등 갱신
  const { isLive, endedAt, viewers } = body;
  // maxViewers, totalViewers도 포함
  const data: Partial<{
    isLive: boolean;
    endedAt: Date;
    viewers: number;
    maxViewers: number;
    totalViewers: number;
  }> = {};
  if (typeof isLive === 'boolean') data.isLive = isLive;
  if (endedAt) data.endedAt = endedAt;
  if (typeof viewers === 'number') data.viewers = viewers;

  // 방송 종료 시 maxViewers, totalViewers 기록
  if (isLive === false) {
    try {
      const redis = await getRedis();
      // Redis에서 maxViewers, totalViewers 값 읽기
      // maxViewers:{streamId}는 String, totalViewers:{streamId}는 Set의 크기
      const [maxViewers, totalViewers] = await Promise.all([
        redis.get(`maxViewers:${id}`),
        redis.sCard(`totalViewers:${id}`), // set에 유니크 시청자 ID 저장했다고 가정
      ]);
      if (maxViewers) data.maxViewers = parseInt(maxViewers, 10);
      if (typeof totalViewers === 'number') data.totalViewers = totalViewers;
    } catch (err) {
      // Redis 에러는 무시하고 진행
      console.error('maxViewers/totalViewers 기록 실패:', err);
    }
  }

  const stream = await prisma.stream.update({ where: { id }, data });
  return NextResponse.json(stream);
}
