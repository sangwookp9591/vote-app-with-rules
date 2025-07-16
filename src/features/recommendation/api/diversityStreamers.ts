import type { PopularStreamer } from '@/entities/streamer/model/types';

/**
 * 다양성 추천 API 호출 (내가 한 번도 안 본 스트리머 중 평점/시청자 수 높은 순)
 * - 실제 구현 필요
 */
export async function fetchDiversityStreamers(): Promise<PopularStreamer[]> {
  const res = await fetch('/api/streamers/diversity');
  if (!res.ok) throw new Error('다양성 추천 조회 실패');
  return res.json();
}
