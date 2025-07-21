import { User } from '@/entities/user';

const API_BASE = '/api/users/';

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('유저 조회 실패');
  return res.json();
}
