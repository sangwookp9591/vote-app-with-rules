import { createClient } from 'redis';

// Redis 연결 주소 로그 출력 (실무적 진단)
const redisUrl = process.env.NEXT_PUBLIC_REDIS_URL || 'redis://redis:6379';
console.log('Redis 연결 주소:', redisUrl);

// .env에 NEXT_PUBLIC_REDIS_URL=redis://localhost:6379 등으로 설정 필요
const redis = createClient({ url: redisUrl });

let isConnected = false;

// 실무적으로 안전하게 Redis에 연결 (최대 5회, 1초 간격 재시도)
export async function getRedis() {
  if (!isConnected) {
    let attempt = 0;
    const maxAttempts = 5;
    while (attempt < maxAttempts) {
      try {
        await redis.connect();
        isConnected = true;
        break; // 연결 성공 시 반복 종료
      } catch (err) {
        attempt++;
        // 스택 트레이스까지 출력하여 에러 발생 위치 추적
        console.error(`Redis 연결 실패 (시도 ${attempt}/${maxAttempts}):`, err, new Error().stack);
        if (attempt >= maxAttempts) {
          // 최종 실패 시 에러 throw (기존 로직과 호환)
          throw new Error('Redis 연결에 반복적으로 실패했습니다. 서버 관리자에게 문의하세요.');
        }
        // 1초 대기 후 재시도
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }
  return redis;
}
