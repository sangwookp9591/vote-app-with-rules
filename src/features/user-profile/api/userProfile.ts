const API_URL = `/api/users/`;
export type UpdateProfileState = { error?: string; success?: string };

export async function updateMyProfile(prevState: UpdateProfileState, formData: FormData) {
  const userId = formData.get('userId') as string;
  // 프로필 이미지 파일 저장

  const res = await fetch(`${API_URL}${userId}/profile`, {
    method: 'PATCH',
    // headers: { 'Content-Type': 'application/json' },
    body: formData,
  });
  if (!res.ok) throw new Error('이용자 정보 수정 실패');
  return res.json();
}

export async function changePassword(data: { id: string; password: string; newPassword: string }) {
  const res = await fetch(`${API_URL}/${data?.id}/profile/changePassword`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('패스워드 변경 실패');
}
