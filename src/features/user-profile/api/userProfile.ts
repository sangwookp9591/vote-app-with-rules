import { LocalStorageProvider } from '@/shared/storage/LocalStorageProvider';

const API_URL = `/api/user/profile`;

export async function updateMyProfile(formData: FormData) {
  const nickname = formData.get('nickname') as string;

  // 프로필 이미지 파일 저장
  let profileImageUrl: string | undefined = undefined;
  const profileImage = formData.get('profileImage');
  if (profileImage && typeof profileImage === 'object' && 'arrayBuffer' in profileImage) {
    const storage = new LocalStorageProvider();
    profileImageUrl = await storage.upload(profileImage as File, { folder: 'user' });
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, profileImageUrl }),
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
