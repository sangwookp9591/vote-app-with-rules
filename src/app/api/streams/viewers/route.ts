import { NextResponse } from 'next/server';
import { getRedis } from '@/shared/redisClient';

export async function GET() {
  try {
    // 안전하게 Redis에 연결
    const redis = await getRedis();
    // Redis에서 방송방별 시청자 수를 읽어옴 (node-redis)
    const keys = await redis.keys('viewerCount:*');

    // keys가 비어있으면 빈 객체 반환 (에러 방지)
    if (!keys || keys.length === 0) {
      return NextResponse.json({});
    }

    const counts = await redis.mGet(keys);
    const result: Record<string, number> = {};
    keys.forEach((key: string, i: number) => {
      const roomId = key.replace('viewerCount:', '');
      result[roomId] = parseInt(counts[i] || '0', 10);
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Redis 시청자 수 조회 실패:', error);
    // Redis 에러 시 빈 객체 반환 (서비스 중단 방지)
    return NextResponse.json({});
  }
}
