'use server';

import { LocalStorageProvider } from '@/shared/storage/LocalStorageProvider';
import { PrismaClient } from '@prisma/client';

export type SignupFormState = { error?: string; success?: string };

export async function signupAction(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const prisma = new PrismaClient();
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

  // 중복 이메일/닉네임 체크
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
  });
  if (existingUser) {
    if (existingUser.email === email) {
      return { error: '이미 사용 중인 이메일입니다.' };
    }
    if (existingUser.nickname === nickname) {
      return { error: '이미 사용 중인 닉네임입니다.' };
    }
  }

  // 비밀번호 해싱 (실제 서비스에서는 bcrypt 등 사용 권장)
  // 여기서는 예시로 평문 저장 (실서비스에서는 절대 금지!)
  try {
    await prisma.user.create({
      data: {
        email,
        password, // TODO: bcrypt로 해싱 필요
        nickname,
        profileImageUrl,
      },
    });
    return { success: '회원가입이 완료되었습니다!' };
  } catch {
    return { error: '회원가입 중 오류가 발생했습니다.' };
  } finally {
    await prisma.$disconnect();
  }
}
