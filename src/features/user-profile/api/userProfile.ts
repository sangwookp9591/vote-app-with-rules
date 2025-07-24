const API_URL = `/api/user/profile`;

export async function updateMyProfile(data: {
  nickname: string;
  description: string;
  profileImageUrl?: string;
}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('이용자 정보 수정 실패');
  return res.json();
}

export async function changePassword(data: { password: string; newPassword: string }) {
  const res = await fetch(`${API_URL}/changePassword`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('패스워드 변경 실패');
}
