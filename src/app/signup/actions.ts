'use server';

import { LocalStorageProvider } from '@/shared/storage/LocalStorageProvider';

export type SignupFormState = { error?: string; success?: string };

export async function signupAction(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const email = formData.get('email') as string;
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;
  // const isStreamer = formData.get('isStreamer') === 'on'; // 추후 사용

  // 프로필 이미지 파일 저장
  let profileImageUrl: string | undefined = undefined;
  const profileImage = formData.get('profileImage');
  if (profileImage && typeof profileImage === 'object' && 'arrayBuffer' in profileImage) {
    const storage = new LocalStorageProvider();
    profileImageUrl = await storage.upload(profileImage as File, { folder: 'user' });
  }

  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return { error: '올바른 이메일을 입력하세요.' };
  }
  if (!nickname || nickname.length < 2) {
    return { error: '닉네임은 2자 이상이어야 합니다.' };
  }
  if (!password || password.length < 6) {
    return { error: '비밀번호는 6자 이상이어야 합니다.' };
  }

  // TODO: 실제 회원가입 처리(DB 등)
  // 예시: profileImageUrl을 DB에 저장하는 로직이 들어가야 함
  return {
    success: `회원가입이 완료되었습니다!${profileImageUrl ? ' (이미지: ' + profileImageUrl + ')' : ''}`,
  };
}
