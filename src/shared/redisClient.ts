// node-redis (redis 패키지) 기반 Redis 클라이언트 (실시간 시청자 수 등 공용 데이터 관리)
import { createClient } from 'redis';

// .env에 NEXT_PUBLIC_REDIS_URL=redis://localhost:6379 등으로 설정 필요
const redis = createClient({ url: process.env.NEXT_PUBLIC_REDIS_URL });

let isConnected = false;
export async function getRedis() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
  }
  return redis;
}

export default redis;
