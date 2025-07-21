import { UserDetail } from '@/entities/user/detail';

const API_BASE = '/api/userDetail/';

export async function fetchUserDetail(id: string): Promise<UserDetail> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('유저 상세 조회 실패');
  return res.json();
}
