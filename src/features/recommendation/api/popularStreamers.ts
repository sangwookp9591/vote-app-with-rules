import type { PopularStreamer } from '@/entities/streamer/model/types';

/**
 * 인기 스트리머 추천 API 호출
 * - 최근 1주일간 시청자 수, 팔로워 수, 투표수 기준 랭킹
 */
export async function fetchPopularStreamers(): Promise<PopularStreamer[]> {
  const res = await fetch('/api/streamers/popular');
  if (!res.ok) throw new Error('인기 스트리머 추천 조회 실패');
  return res.json();
}
