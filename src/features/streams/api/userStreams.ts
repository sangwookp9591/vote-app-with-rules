import { Stream } from '@/entities/stream/model/types';

// userId로 해당 사용자의 방송 목록을 가져오는 함수
export async function fetchUserStreams(userId: string): Promise<Stream[]> {
  if (!userId) return [];
  const res = await fetch(`/api/streams/user/${userId}`);
  if (!res.ok) throw new Error('방송 정보 조회 실패');
  return res.json();
}
