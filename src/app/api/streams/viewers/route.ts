import { NextResponse } from 'next/server';
import { getRedis } from '@/shared/redisClient';

export async function GET() {
  // 안전하게 Redis에 연결
  const redis = await getRedis();
  // Redis에서 방송방별 시청자 수를 읽어옴 (node-redis)
  const keys = await redis.keys('viewerCount:*');
  const counts = await redis.mGet(keys);
  const result: Record<string, number> = {};
  keys.forEach((key: string, i: number) => {
    const roomId = key.replace('viewerCount:', '');
    result[roomId] = parseInt(counts[i] || '0', 10);
  });
  return NextResponse.json(result);
}
