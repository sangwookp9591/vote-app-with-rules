import { Follow } from '@/entities/follow';

const API_BASE = '/api/follow/toggle';

export async function fetchFollowToggle(data: {
  userId: string;
  streamerId: string;
}): Promise<Follow> {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('팔로워 토글 실패');
  return res.json();
}
