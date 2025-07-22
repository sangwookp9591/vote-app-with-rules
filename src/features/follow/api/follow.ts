import { Follow } from '@/entities/follow';

const API_BASE = '/api/follow';

export async function fetchFollowToggle(data: {
  userId: string;
  streamerId: string;
}): Promise<Follow> {
  const res = await fetch(`${API_BASE}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('팔로워 토글 실패');
  return res.json();
}

export async function fetchCheckFollower(data: {
  userId?: string;
  streamerId: string;
}): Promise<{ isFollower: boolean }> {
  const url = `${API_BASE}/check?userId=${data?.userId}&streamerId=${data?.streamerId}`;
  const res = await fetch(`${url}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('팔로워 여부 확인 실패');
  return res.json();
}
